import { NextResponse } from "next/server";
import connectToDb from "../../../../../configs/db";
import Users from "../../../../../models/Users";
import GameSession from "../../../../../models/GameSession";
import mongoose from "mongoose";
import { triggerEvent } from "@/utils/pusherServer";

export async function POST(req) {
  try {
    await connectToDb();

    const body = await req.json();
    const { sessionId, userId } = body || {};

    if (!sessionId || !userId) {
      return NextResponse.json({ message: "اطلاعات ناقص است" }, { status: 400 });
    }

    const user = await Users.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "کاربر یافت نشد" }, { status: 401 });
    }

    const sessionDoc = await GameSession.findById(sessionId);
    if (!sessionDoc) {
      return NextResponse.json({ message: "جلسه یافت نشد" }, { status: 404 });
    }

    const pending = sessionDoc.pendingResult;
    if (!pending || !pending.proposer) {
      return NextResponse.json(
        { message: "نتیجه‌ای برای رد کردن پیدا نشد" },
        { status: 400 }
      );
    }

    // اطمینان از اینکه کاربر فعلی همان حریف است (و پیشنهاد دهنده نیست)
    const proposerId = pending.proposer.toString();
    if (proposerId === userId.toString()) {
      return NextResponse.json(
        { message: "شما نمی‌توانید نتیجه پیشنهادی خود را رد کنید" },
        { status: 403 }
      );
    }

    // اطمینان از اینکه کاربر یکی از بازیکنان جلسه است
    const isParticipant = [
      sessionDoc.player1?.toString(),
      sessionDoc.player2?.toString(),
    ].includes(userId.toString());
    if (!isParticipant) {
      return NextResponse.json(
        { message: "فقط بازیکنان جلسه می‌توانند نتیجه را رد کنند" },
        { status: 403 }
      );
    }

    // نتیجه معلق را پاک کن
    sessionDoc.pendingResult = null;
    await sessionDoc.save();

    // به پیشنهاد دهنده اطلاع بده که نتیجه‌اش رد شد
    try {
      await triggerEvent(`user-${proposerId}`, "result-rejected", {
        sessionId: sessionDoc._id,
        rejectedBy: userId,
      });
    } catch (err) {
      console.error("Pusher reject notify error:", err?.message || err);
    }

    return NextResponse.json(
      { message: "نتیجه پیشنهادی رد شد. می‌توانید نتیجه جدیدی ثبت کنید." },
      { status: 200 }
    );
  } catch (err) {
    console.error("Reject Result Error:", err);
    return NextResponse.json(
      { message: "خطای داخلی سرور", error: err.message },
      { status: 500 }
    );
  }
}