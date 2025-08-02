import { verifyAccessToken } from "@/utils/auth";
import connectToDb from "../../../../configs/db";
import Comment from "../../../../models/Comment";
import UserModel from "../../../../models/Users";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req) {
  await connectToDb();

  const page = Number(req.nextUrl.searchParams.get("page") || 1);
  const limit = 10;
  const skip = (page - 1) * limit;

  const comments = await Comment.find({ isAccept: false })
    .populate("user", "userName")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Comment.countDocuments({ isAccept: false });

  return NextResponse.json({ comments, total });
}

export async function POST(req) {
  await connectToDb();

  const token = await cookies().get("accessToken")?.value;

  if (!token)
    return NextResponse.json({ message: "توکن ارسال نشده" }, { status: 401 });

  const payload = await verifyAccessToken(token);
  if (!payload)
    return NextResponse.json({ message: "توکن نامعتبر است" }, { status: 403 });
  const user = await UserModel.findById(payload.id);
  console.log(payload);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { message } = await req.json();
  if (!message || message.trim().length < 3) {
    return NextResponse.json(
      { error: "کامنت خیلی کوتاه است." },
      { status: 400 }
    );
  }

  const newComment = await Comment.create({
    user: user._id,
    message,
    isAccept: false
  });

  return NextResponse.json({ message: "کامنت ثبت شد و منتظر تأیید است." });
}
