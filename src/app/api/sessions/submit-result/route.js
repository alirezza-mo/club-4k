import { NextResponse } from "next/server";
import connectToDb from "../../../../../configs/db";
import Users from "../../../../../models/Users";
import GameSession from "../../../../../models/GameSession";
import Console from "../../../../../models/Console";
import mongoose from "mongoose";
import { cleanupPendingSessions } from "@/utils/cleanUpPendingSession";
import { triggerEvent } from "@/utils/pusherServer";

const COOLDOWN_MINUTES = 10;

export async function POST(req) {
  try {
    await connectToDb();
    await cleanupPendingSessions();

    const body = await req.json();
    const { sessionId, userId, player1Goals, player2Goals } = body || {};

    if (!sessionId || !userId || typeof player1Goals !== "number" || typeof player2Goals !== "number") {
      return NextResponse.json({ message: "اطلاعات جلسه یا نتیجه ناقص است" }, { status: 400 });
    }

    const user = await Users.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "کاربر یافت نشد، لطفاً ثبت نام کنید" }, { status: 401 });
    }

    const sessionDoc = await GameSession.findById(sessionId).populate("console");
    if (!sessionDoc) {
      return NextResponse.json({ message: "جلسه یافت نشد" }, { status: 404 });
    }

    // only participants can propose results
    const isPlayer1 = sessionDoc.player1 && sessionDoc.player1.toString() === userId.toString();
    const isPlayer2 = sessionDoc.player2 && sessionDoc.player2.toString() === userId.toString();
    if (!isPlayer1 && !isPlayer2) {
      return NextResponse.json({ message: "فقط بازیکنان این جلسه می‌توانند نتیجه را ثبت کنند" }, { status: 403 });
    }

    // Ensure user and console belong to same gameNet (if available)
    if (user.gameNet && sessionDoc.console && sessionDoc.console.location && user.gameNet.toString() !== sessionDoc.console.location.toString()) {
      return NextResponse.json({ message: "کاربر و کنسول در یک گیم‌نت نیستند" }, { status: 403 });
    }

    // cooldown check
    if (user.lastResultAt) {
      const diff = Date.now() - new Date(user.lastResultAt).getTime();
      if (diff < COOLDOWN_MINUTES * 60 * 1000) {
        return NextResponse.json({ message: `شما تازه نتیجه ثبت کرده‌اید. لطفاً ${COOLDOWN_MINUTES} دقیقه بعد تلاش کنید.` }, { status: 403 });
      }
    }

    // session must be ended to submit a result (we require scan end first)
    if (sessionDoc.status !== "ended") {
      return NextResponse.json({ message: "ابتدا جلسه را به اتمام برسانید سپس نتیجه را ثبت کنید" }, { status: 400 });
    }

    // if there's already a pending result
    if (sessionDoc.pendingResult && sessionDoc.pendingResult.proposer && !sessionDoc.pendingResult.confirmedBy) {
      return NextResponse.json({ message: "نتیجه‌ای قبلاً ثبت شده و منتظر تایید است" }, { status: 409 });
    }

    // Save pending result
    sessionDoc.pendingResult = {
      proposer: user._id,
      proposerGoals: isPlayer1 ? player1Goals : player2Goals,
      opponentGoals: isPlayer1 ? player2Goals : player1Goals,
      confirmedBy: null,
      createdAt: new Date(),
    };

    await sessionDoc.save();

    // Notify opponent in real-time (via Pusher)
    try {
      const opponentId = sessionDoc.player1 && sessionDoc.player1.toString() === user._id.toString() ? sessionDoc.player2 : sessionDoc.player1;
      if (opponentId) {
        await triggerEvent(`user-${opponentId.toString()}`, 'pending-result', {
          sessionId: sessionDoc._id,
          from: user._id,
          proposerGoals: sessionDoc.pendingResult.proposerGoals,
          opponentGoals: sessionDoc.pendingResult.opponentGoals,
        });
      }
    } catch (err) {
      console.error('Pusher notify error:', err?.message || err);
    }

    return NextResponse.json({ message: "نتیجه ثبت شد و منتظر تایید رقیب است", pendingResult: sessionDoc.pendingResult }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "خطای داخلی سرور", error: err.message }, { status: 500 });
  }
}
