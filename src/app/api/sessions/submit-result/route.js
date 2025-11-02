import { NextResponse } from "next/server";
import connectToDb from "../../../../../configs/db";
import Users from "../../../../../models/Users";
import GameSession from "../../../../../models/GameSession";
// import Console from "../../../../../models/Console"; // این import استفاده نشده و حذف شد
import mongoose from "mongoose";
import { cleanupPendingSessions } from "@/utils/cleanUpPendingSession";
import { triggerEvent } from "@/utils/pusherServer";

const COOLDOWN_MINUTES = 10; // 10 دقیقه

export async function POST(req) {
  try {
    await connectToDb();
    await cleanupPendingSessions();

    const body = await req.json();
    const { sessionId, userId, player1Goals, player2Goals } = body || {};

    if (
      !sessionId ||
      !userId ||
      typeof player1Goals !== "number" ||
      typeof player2Goals !== "number"
    ) {
      return NextResponse.json(
        { message: "اطلاعات جلسه یا نتیجه ناقص است" },
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

    const sessionDoc = await GameSession.findById(sessionId).populate("console");
    if (!sessionDoc) {
      return NextResponse.json({ message: "جلسه یافت نشد" }, { status: 404 });
    }

    // only participants can propose results
    const isPlayer1 =
      sessionDoc.player1 && sessionDoc.player1.toString() === userId.toString();
    const isPlayer2 =
      sessionDoc.player2 && sessionDoc.player2.toString() === userId.toString();
    if (!isPlayer1 && !isPlayer2) {
      return NextResponse.json(
        { message: "فقط بازیکنان این جلسه می‌توانند نتیجه را ثبت کنند" },
        { status: 403 }
      );
    }

    // Ensure user and console belong to same gameNet (if available)
    if (
      user.gameNet &&
      sessionDoc.console &&
      sessionDoc.console.location &&
      user.gameNet.toString() !== sessionDoc.console.location.toString()
    ) {
      return NextResponse.json(
        { message: "کاربر و کنسول در یک گیم‌نت نیستند" },
        { status: 403 }
      );
    }

    // [!!! شروع تغییرات اساسی !!!]

    // 1. جلسه باید "فعال" باشد تا بتوان نتیجه ثبت کرد
    if (sessionDoc.status !== "active") {
      return NextResponse.json(
        { message: "فقط در طول یک جلسه فعال می‌توانید نتیجه ثبت کنید" },
        { status: 400 }
      );
    }

    // 2. بررسی Cooldown (قانون 10 دقیقه)
    const now = Date.now();
    const cooldownMs = COOLDOWN_MINUTES * 60 * 1000;

    // آخرین نتیجه‌ای که "تایید" شده را پیدا کن (از آرایه results)
    // (آرایه results توسط /api/confirm-result پر می‌شود)
    const lastResult =
      sessionDoc.results && sessionDoc.results.length > 0
        ? sessionDoc.results[sessionDoc.results.length - 1]
        : null;

    if (lastResult) {
      // این نتیجه اول نیست. چک کن 10 دقیقه از نتیجه قبلی گذشته باشد.
      const lastResultTime = new Date(lastResult.recordedAt).getTime();
      const diff = now - lastResultTime;
      if (diff < cooldownMs) {
        const minutesLeft = Math.ceil((cooldownMs - diff) / 60000);
        return NextResponse.json(
          {
            message: `نتیجه قبلی به تازگی ثبت شده. لطفاً ${
              minutesLeft || 1
            } دقیقه دیگر تلاش کنید.`,
          },
          { status: 403 }
        );
      }
    } else {
      // این اولین نتیجه است. چک کن 10 دقیقه از "شروع جلسه" (startedAt) گذشته باشد
      if (!sessionDoc.startedAt) {
        return NextResponse.json(
          { message: "جلسه هنوز زمان شروع معتبر ندارد" },
          { status: 400 }
        );
      }
      const sessionStartTime = new Date(sessionDoc.startedAt).getTime();
      const diff = now - sessionStartTime;
      if (diff < cooldownMs) {
        const minutesLeft = Math.ceil((cooldownMs - diff) / 60000);
        return NextResponse.json(
          {
            message: `باید حداقل ${COOLDOWN_MINUTES} دقیقه از شروع بازی بگذرد. لطفاً ${
              minutesLeft || 1
            } دقیقه دیگر تلاش کنید.`,
          },
          { status: 403 }
        );
      }
    }

    // [!!! پایان تغییرات اساسی !!!]

    // 3. if there's already a pending result
    if (
      sessionDoc.pendingResult &&
      sessionDoc.pendingResult.proposer &&
      !sessionDoc.pendingResult.confirmedBy
    ) {
      return NextResponse.json(
        { message: "نتیجه‌ای قبلاً ثبت شده و منتظر تایید است" },
        { status: 409 }
      );
    }

    // 4. Save pending result
    sessionDoc.pendingResult = {
      proposer: user._id,
      proposerGoals: isPlayer1 ? player1Goals : player2Goals,
      opponentGoals: isPlayer1 ? player2Goals : player1Goals,
      confirmedBy: null,
      createdAt: new Date(),
    };

    await sessionDoc.save();

    // 5. Notify opponent in real-time (via Pusher)
    try {
      const opponentId =
        sessionDoc.player1 &&
        sessionDoc.player1.toString() === user._id.toString()
          ? sessionDoc.player2
          : sessionDoc.player1;
      if (opponentId) {
        await triggerEvent(`user-${opponentId.toString()}`, "pending-result", {
          sessionId: sessionDoc._id,
          from: user._id,
          proposerGoals: sessionDoc.pendingResult.proposerGoals,
          opponentGoals: sessionDoc.pendingResult.opponentGoals,
        });
      }
    } catch (err) {
      console.error("Pusher notify error:", err?.message || err);
    }

    return NextResponse.json(
      {
        message: "نتیجه ثبت شد و منتظر تایید رقیب است",
        pendingResult: sessionDoc.pendingResult,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Submit Result Error:", err);
    return NextResponse.json(
      { message: "خطای داخلی سرور", error: err.message },
      { status: 500 }
    );
  }
}