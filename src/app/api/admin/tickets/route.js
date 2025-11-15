import connectToDb from "../../../../../configs/db";
import Admin from "../../../../../models/Admin";
import Users from "../../../../../models/Users";
import Ticket from "../../../../../models/Ticket";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/utils/auth";

export async function GET(req) {
  try {
    await connectToDb();

    const token = cookies().get("accessToken")?.value;
    if (!token) return NextResponse.json({ error: "توکن ارسال نشده" }, { status: 401 });

    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch (err) {
      return NextResponse.json({ error: "توکن نامعتبر" }, { status: 401 });
    }

    const admin = await Admin.findById(payload.id);
    if (!admin) return NextResponse.json({ error: "ادمین یافت نشد" }, { status: 403 });

    const page = Number(req.nextUrl.searchParams.get("page") || 1);
    const limit = Number(req.nextUrl.searchParams.get("limit") || 20);
    const skip = (page - 1) * limit;

    // find users for this admin's gameNet
    const users = await Users.find({ gameNet: admin.gameNet }).select("_id");
    const userIds = users.map((u) => u._id);

    const tickets = await Ticket.find({ user: { $in: userIds } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const mapped = tickets.map((t) => ({
      id: t._id,
      title: t.title,
      priority: t.priority,
      status: t.isAnswer ? "پاسخ داده‌شده" : "باز",
      date: t.createdAt,
    }));

    return NextResponse.json({ tickets: mapped, page, limit });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
