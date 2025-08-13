import { NextResponse } from "next/server";
import connectToDb from "../../../../configs/db";
import Users from "../../../../models/Users";
import GameSession from "../../../../models/GameSession";
import Console from "../../../../models/Console";
import mongoose from "mongoose";
import { cleanupPendingSessions } from "../../../../lib/utils";

export async function POST(req) {
  try {
    await connectToDb();
    await cleanupPendingSessions(); // چک جلسات منقضی‌شده

    const body = await req.json();
    const { barcode, userId } = body || {};

    if (!barcode || !userId) {
      return NextResponse.json(
        { message: "بارکد و شناسه کاربر الزامی هستند" },
        { status: 400 }
      );
    }

    const user = await Users.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: "کاربر یافت نشد، لطفاً ثبت نام کنید" },
        { status: 401 }
      );
    }

    const consoleDevice = await Console.findOne({ barcode });
    if (!consoleDevice) {
      return NextResponse.json({ message: "کنسول یافت نشد" }, { status: 404 });
    }

    if (consoleDevice.status === "busy" && consoleDevice.currentSession) {
      const session = await GameSession.findById(consoleDevice.currentSession);
      if (session && session.status === "active") {
        return NextResponse.json(
          {
            message: `کنسول ${consoleDevice.name} در حال حاضر مشغول است، منتظر پایان جلسه باشید`,
            session,
            state: "active",
            player1: session.player1,
            player2: session.player2,
          },
          { status: 403 }
        );
      }
    }

    const session = await mongoose.startSession();
    try {
      await session.startTransaction();

      const consoleDeviceLocked = await Console.findOne({ barcode }).session(session);
      if (!consoleDeviceLocked) {
        throw new Error("کنسول یافت نشد");
      }

      let gameSession;
      if (!consoleDeviceLocked.currentSession) {
        gameSession = await GameSession.create(
          [
            {
              console: consoleDeviceLocked._id,
              player1: user._id,
              status: "pendingStart",
              createdAt: new Date(),
            },
          ],
          { session }
        );

        consoleDeviceLocked.currentSession = gameSession[0]._id;
        consoleDeviceLocked.status = "busy";
        await consoleDeviceLocked.save({ session });

        await session.commitTransaction();
        return NextResponse.json(
          {
            message: `کاربر اول اسکن کرد، منتظر کاربر دوم برای کنسول ${consoleDeviceLocked.name}`,
            session: gameSession[0],
            role: 1,
            state: "pendingStart",
            player1: gameSession[0].player1,
            player2: gameSession[0].player2,
          },
          { status: 200 }
        );
      } else {
        gameSession = await GameSession.findById(consoleDeviceLocked.currentSession).session(session);

        if (!gameSession) {
          consoleDeviceLocked.currentSession = null;
          consoleDeviceLocked.status = "idle";
          await consoleDeviceLocked.save({ session });
          await session.commitTransaction();
          return NextResponse.json(
            { message: "خطای داخلی، جلسه یافت نشد" },
            { status: 500 }
          );
        }

        if (gameSession.status === "pendingStart" && !gameSession.player2) {
          if (gameSession.player1.toString() === user._id.toString()) {
            await session.commitTransaction();
            return NextResponse.json(
              {
                message: "شما قبلاً به عنوان بازیکن اول اسکن کرده‌اید",
                session: gameSession,
                role: 1,
                state: "pendingStart",
                player1: gameSession.player1,
                player2: gameSession.player2,
              },
              { status: 403 }
            );
          }

          gameSession.player2 = user._id;
          gameSession.status = "active";
          gameSession.startedAt = new Date();
          await gameSession.save({ session });

          await session.commitTransaction();
          return NextResponse.json(
            {
              message: `جلسه بازی در کنسول ${consoleDeviceLocked.name} شروع شد`,
              session: gameSession,
              role: 2,
              state: "active",
              player1: gameSession.player1,
              player2: gameSession.player2,
            },
            { status: 200 }
          );
        } else if (gameSession.status === "active") {
          await session.commitTransaction();
          return NextResponse.json(
            {
              message: `کنسول ${consoleDeviceLocked.name} در حال حاضر مشغول است، منتظر پایان جلسه باشید`,
              session: gameSession,
              state: "active",
              player1: gameSession.player1,
              player2: gameSession.player2,
            },
            { status: 403 }
          );
        } else {
          await session.commitTransaction();
          return NextResponse.json(
            {
              message: "جلسه در وضعیت نامعتبر است یا پایان یافته",
              session: gameSession,
              state: gameSession.status,
              player1: gameSession.player1,
              player2: gameSession.player2,
            },
            { status: 400 }
          );
        }
      }
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  } catch (err) {
    return NextResponse.json(
      { message: "خطای داخلی سرور", error: err.message },
      { status: 500 }
    );
  }
}