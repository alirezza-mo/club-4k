import { NextResponse } from "next/server";
import connectToDb from "../../../../../configs/db";
import Users from "../../../../../models/Users";
import GameSession from "../../../../../models/GameSession";
import mongoose from "mongoose";
import { cleanupPendingSessions } from "@/utils/cleanUpPendingSession";

const SOCKET_SERVER_URL = process.env.SOCKET_SERVER_URL || "http://localhost:4001";

export async function POST(req) {
  try {
    await connectToDb();
    await cleanupPendingSessions();

    const body = await req.json();
    const { sessionId, userId } = body || {};

    if (!sessionId || !userId) {
      return NextResponse.json({ message: "اطلاعات ناقص است" }, { status: 400 });
    }

    const user = await Users.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "کاربر یافت نشد" }, { status: 401 });
    }

    const session = await mongoose.startSession();
    try {
      await session.startTransaction();

      const sessionDoc = await GameSession.findById(sessionId).session(session);
      if (!sessionDoc) {
        await session.commitTransaction();
        return NextResponse.json({ message: "جلسه یافت نشد" }, { status: 404 });
      }

      const pending = sessionDoc.pendingResult;
      if (!pending || !pending.proposer || pending.confirmedBy) {
        await session.commitTransaction();
        return NextResponse.json({ message: "نتیجه قابل تایید پیدا نشد" }, { status: 400 });
      }

      // only opponent can confirm
      const proposerId = pending.proposer.toString();
      if (proposerId === userId.toString()) {
        await session.commitTransaction();
        return NextResponse.json({ message: "شما نمی‌توانید نتیجه خود را تایید کنید" }, { status: 403 });
      }

      // ensure user is participant
      const isParticipant = [sessionDoc.player1?.toString(), sessionDoc.player2?.toString()].includes(userId.toString());
      if (!isParticipant) {
        await session.commitTransaction();
        return NextResponse.json({ message: "فقط بازیکنان جلسه می‌توانند نتیجه را تایید کنند" }, { status: 403 });
      }

      // determine final goals for player1 and player2
      let player1Goals, player2Goals;
      if (sessionDoc.player1 && sessionDoc.player1.toString() === proposerId) {
        player1Goals = pending.proposerGoals;
        player2Goals = pending.opponentGoals;
      } else {
        player2Goals = pending.proposerGoals;
        player1Goals = pending.opponentGoals;
      }

      // compute XP changes
      const player1 = await Users.findById(sessionDoc.player1).session(session);
      const player2 = await Users.findById(sessionDoc.player2).session(session);
      if (!player1 || !player2) {
        await session.commitTransaction();
        return NextResponse.json({ message: "اطلاعات بازیکنان ناقص است" }, { status: 500 });
      }

      if (player1Goals > player2Goals) {
        player1.xp = (Number(player1.xp) || 0) + 3;
        player2.xp = (Number(player2.xp) || 0) - 1;
      } else if (player1Goals < player2Goals) {
        player2.xp = (Number(player2.xp) || 0) + 3;
        player1.xp = (Number(player1.xp) || 0) - 1;
      } else {
        player1.xp = (Number(player1.xp) || 0) + 1;
        player2.xp = (Number(player2.xp) || 0) + 1;
      }

      // update lastResultAt for both players to enforce cooldown
      const now = new Date();
      player1.lastResultAt = now;
      player2.lastResultAt = now;

      // persist scores into session results
      sessionDoc.results = sessionDoc.results || [];
      sessionDoc.results.push({ player1Goals, player2Goals, recordedAt: now });

      // clear pendingResult
      sessionDoc.pendingResult = null;

      await player1.save({ session });
      await player2.save({ session });
      await sessionDoc.save({ session });

      await session.commitTransaction();

      // notify both players about the confirmed result (use dynamic import)
      try {
        try {
          const { io: ClientIo } = await import('socket.io-client');
          const socket = ClientIo(SOCKET_SERVER_URL, { transports: ["websocket"], forceNew: true });
          const payload = { sessionId: sessionDoc._id, player1Goals, player2Goals };
          if (player1._id) socket.emit('notify', { toUserId: player1._id.toString(), type: 'result-confirmed', data: payload });
          if (player2._id) socket.emit('notify', { toUserId: player2._id.toString(), type: 'result-confirmed', data: payload });
          socket.close();
        } catch (err2) {
          console.error('Socket notify import/send error:', err2?.message || err2);
        }
      } catch (err) {
        console.error('Socket notify error:', err.message || err);
      }

      return NextResponse.json({ message: "نتیجه تایید شد و امتیازات محاسبه شد", results: sessionDoc.results }, { status: 200 });
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  } catch (err) {
    return NextResponse.json({ message: "خطای داخلی سرور", error: err.message }, { status: 500 });
  }
}
