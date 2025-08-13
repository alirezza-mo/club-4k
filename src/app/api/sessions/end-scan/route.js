import { NextResponse } from "next/server";
import connectToDb from "../../../../../configs/db";
import Users from "../../../../../models/Users";
import Console from "../../../../../models/Console";
import GameSession from "../../../../../models/GameSession";
import mongoose from "mongoose";
import { cleanupPendingSessions } from "../../../../utils/cleanUpPendingSession";

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
    if (!consoleDevice || !consoleDevice.currentSession) {
      return NextResponse.json(
        { message: "جلسه فعالی برای این کنسول یافت نشد" },
        { status: 404 }
      );
    }

    const session = await mongoose.startSession();
    try {
      await session.startTransaction();

      const gameSession = await GameSession.findById(consoleDevice.currentSession).session(session);
      if (!gameSession) {
        consoleDevice.currentSession = null;
        consoleDevice.status = "idle";
        await consoleDevice.save({ session });
        await session.commitTransaction();
        return NextResponse.json(
          {
            message: "خطای داخلی، جلسه یافت نشد",
            state: "ended",
            player1: null,
            player2: null,
          },
          { status: 500 }
        );
      }

      if (gameSession.status === "active") {
        if (
          ![
            gameSession.player1?.toString(),
            gameSession.player2?.toString(),
          ].includes(user._id.toString())
        ) {
          await session.commitTransaction();
          return NextResponse.json(
            {
              message: "فقط بازیکنان این جلسه می‌توانند آن را پایان دهند",
              session: gameSession,
              state: "active",
              player1: gameSession.player1,
              player2: gameSession.player2,
            },
            { status: 403 }
          );
        }

        gameSession.status = "pendingEnd";
        gameSession.pendingByUser = user._id;
        await gameSession.save({ session });

        await session.commitTransaction();
        return NextResponse.json(
          {
            message: `منتظر اسکن بازیکن دوم برای پایان جلسه در کنسول ${consoleDevice.name}`,
            session: gameSession,
            state: "pendingEnd",
            player1: gameSession.player1,
            player2: gameSession.player2,
          },
          { status: 200 }
        );
      } else if (gameSession.status === "pendingEnd") {
        if (gameSession.pendingByUser.toString() === user._id.toString()) {
          await session.commitTransaction();
          return NextResponse.json(
            {
              message: "شما قبلاً اسکن کرده‌اید، منتظر اسکن بازیکن دیگر باشید",
              session: gameSession,
              state: "pendingEnd",
              player1: gameSession.player1,
              player2: gameSession.player2,
            },
            { status: 403 }
          );
        }

        if (
          ![
            gameSession.player1?.toString(),
            gameSession.player2?.toString(),
          ].includes(user._id.toString())
        ) {
          await session.commitTransaction();
          return NextResponse.json(
            {
              message: "فقط بازیکنان این جلسه می‌توانند آن را پایان دهند",
              session: gameSession,
              state: "pendingEnd",
              player1: gameSession.player1,
              player2: gameSession.player2,
            },
            { status: 403 }
          );
        }

        gameSession.status = "ended";
        gameSession.endedAt = new Date();
        gameSession.durationSeconds = Math.floor(
          (gameSession.endedAt - gameSession.startedAt) / 1000
        );
        gameSession.pendingByUser = null;
        await gameSession.save({ session });

        consoleDevice.status = "idle";
        consoleDevice.currentSession = null;
        await consoleDevice.save({ session });

        await session.commitTransaction();
        return NextResponse.json(
          {
            message: `جلسه در کنسول ${consoleDevice.name} پایان یافت و کنسول آزاد شد`,
            session: gameSession,
            state: "ended",
            player1: gameSession.player1,
            player2: gameSession.player2,
          },
          { status: 200 }
        );
      } else if (gameSession.status === "pendingStart") {
        await session.commitTransaction();
        return NextResponse.json(
          {
            message: "جلسه هنوز شروع نشده است",
            session: gameSession,
            state: "pendingStart",
            player1: gameSession.player1,
            player2: gameSession.player2,
          },
          { status: 400 }
        );
      } else if (gameSession.status === "ended") {
        await session.commitTransaction();
        return NextResponse.json(
          {
            message: "جلسه قبلاً پایان یافته است",
            session: gameSession,
            state: "ended",
            player1: gameSession.player1,
            player2: gameSession.player2,
          },
          { status: 400 }
        );
      } else {
        await session.commitTransaction();
        return NextResponse.json(
          {
            message: "وضعیت نامعتبر جلسه",
            session: gameSession,
            state: gameSession.status,
            player1: gameSession.player1,
            player2: gameSession.player2,
          },
          { status: 400 }
        );
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