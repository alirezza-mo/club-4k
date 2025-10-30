import { NextResponse } from "next/server";
import connectToDb from "../../../../../configs/db";
import Users from "../../../../../models/Users";
import GameSession from "../../../../../models/GameSession";
import { cleanupPendingSessions } from "@/utils/cleanUpPendingSession";

export async function POST(req) {
  try {
    await connectToDb();
    await cleanupPendingSessions();

    const body = await req.json();
    const { userId } = body || {};

    if (!userId) {
      return NextResponse.json({ message: "شناسه کاربر الزامی است" }, { status: 400 });
    }

    const user = await Users.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "کاربر یافت نشد" }, { status: 401 });
    }

    // جستجو برای جلسه‌ای که این کاربر در آن فعال است (player1 یا player2)
    // و وضعیت آن "شروع نشده"، "فعال" یا "در انتظار پایان" است
    const activeSession = await GameSession.findOne({
      $or: [{ player1: userId }, { player2: userId }],
      status: { $in: ["pendingStart", "active", "pendingEnd"] }
    }).populate("console");

    if (!activeSession) {
      // کاربر در هیچ جلسه فعالی نیست
      return NextResponse.json({ message: "جلسه فعالی یافت نشد", session: null }, { status: 200 });
    }

    // کاربر یک جلسه فعال دارد، آن را برگردان
    return NextResponse.json({ 
      message: "جلسه فعال یافت شد", 
      session: activeSession 
    }, { status: 200 });

  } catch (err) {
    return NextResponse.json({ message: "خطای داخلی سرور", error: err.message }, { status: 500 });
  }
}