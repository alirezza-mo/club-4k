import User from "../../../../models/Users";
import { NextResponse } from "next/server";
import connectToDb from "../../../../configs/db";

export async function GET(req) {
  await connectToDb();
  try {
    const url = req.nextUrl;
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(url.searchParams.get("limit") || "10", 10)));
    const skip = (page - 1) * limit;

    const [total, users] = await Promise.all([
      User.countDocuments(),
      User.find({}).select("_id userName gameNet avatar rank profile xp phone firstName lastName isActive").skip(skip).limit(limit).lean(),
    ]);

    return NextResponse.json({ users, total, page, limit });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
