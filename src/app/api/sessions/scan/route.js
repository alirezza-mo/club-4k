import { NextResponse } from "next/server";
import connectToDb from "../../../../../configs/db";
import Users from "../../../../../models/Users";
import GameSession from "../../../../../models/GameSession";
import Console from "../../../../../models/Console";
import mongoose from "mongoose";
import { cleanupPendingSessions } from "@/utils/cleanUpPendingSession";
import { triggerEvent } from "@/utils/pusherServer";

export async function POST(req) {
  try {
    await connectToDb();
    await cleanupPendingSessions(); // چک جلسات منقضی‌شده

    const body = await req.json();
    let { barcode, userId } = body || {};

    console.log("Raw body received:", JSON.stringify(body));
    console.log("Raw barcode from body:", barcode);

    // Parse barcode if it's a JSON string
    if (typeof barcode === "string") {
      try {
        const parsed = JSON.parse(barcode);
        if (parsed && parsed.barcode) {
          barcode = parsed.barcode;
          console.log("Parsed barcode from JSON string:", barcode);
        } else if (parsed) {
          barcode = parsed;
          console.log("Using entire parsed object as barcode:", barcode);
        }
      } catch (e) {
        // Not JSON, use as is
        barcode = barcode.trim();
      }
    } else if (typeof barcode === "object" && barcode !== null) {
      // If barcode is an object with a barcode property
      if (barcode.barcode) {
        barcode = barcode.barcode;
        console.log("Extracted barcode from object:", barcode);
      }
    }

    // Clean and normalize barcode
    if (typeof barcode === "string") {
      barcode = barcode.trim();
    }

    console.log("Final barcode after processing:", barcode);

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

    // Try multiple search methods
    let consoleDevice = null;

    // Method 1: Exact match
    consoleDevice = await Console.findOne({ barcode });
    console.log(
      "Method 1 - Exact match result:",
      consoleDevice ? "Found" : "Not found"
    );

    // Method 2: Trim whitespace from both sides
    if (!consoleDevice) {
      const trimmedBarcode = barcode.trim();
      consoleDevice = await Console.findOne({ barcode: trimmedBarcode });
      console.log(
        "Method 2 - Trimmed search result:",
        consoleDevice ? "Found" : "Not found"
      );
    }

    // Method 3: Partial match (in case of encoding issues)
    if (!consoleDevice) {
      const regexPattern = new RegExp(
        barcode.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );
      consoleDevice = await Console.findOne({
        barcode: { $regex: regexPattern },
      });
      console.log(
        "Method 3 - Regex search result:",
        consoleDevice ? "Found" : "Not found"
      );
    }

    if (!consoleDevice) {
      // Debug logging
      const allConsoles = await Console.find({}).select("barcode name").lean();
      console.log("=".repeat(50));
      console.log("SEARCH FAILED");
      console.log("Received barcode:", JSON.stringify(barcode));
      console.log("Barcode length:", barcode.length);
      console.log(
        "Barcode char codes:",
        [...barcode].map((c) => c.charCodeAt(0)).join(",")
      );
      console.log("Total consoles in DB:", allConsoles.length);
      console.log("Available consoles:", allConsoles);
      console.log("=".repeat(50));

      return NextResponse.json(
        {
          message: "کنسول یافت نشد",
          debug: {
            receivedBarcode: barcode,
            totalConsoles: allConsoles.length,
            availableConsoles: allConsoles,
          },
        },
        { status: 404 }
      );
    }

    // اطمینان از اینکه کاربر و کنسول متعلق به یک گیم‌نت هستند
    if (
      user.gameNet &&
      consoleDevice.location &&
      user.gameNet.toString() !== consoleDevice.location.toString()
    ) {
      return NextResponse.json(
        { message: "کاربر و کنسول در یک گیم‌نت نیستند" },
        { status: 403 }
      );
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

      const consoleDeviceLocked = await Console.findOne({ barcode }).session(
        session
      );
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
        gameSession = await GameSession.findById(
          consoleDeviceLocked.currentSession
        ).session(session);

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

          try {
            const payload = {
              message: `جلسه بازی در کنسول ${consoleDeviceLocked.name} شروع شد`,
              session: gameSession,
              state: "active",
              player1: gameSession.player1,
              player2: gameSession.player2,
            }; // ارسال ایونت فقط برای بازیکن اول (player1)
            await triggerEvent(
              `user-${gameSession.player1.toString()}`,
              "session-updated",
              payload
            );
          } catch (err) {
            console.error(
              "Pusher notify error (session-start):",
              err?.message || err
            );
          }

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
