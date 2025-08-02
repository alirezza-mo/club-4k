import { cookies } from "next/headers";
import connectToDb from "../../../../configs/db";
import { verifyAccessToken } from "@/utils/auth";
import UserModel from "../../../../models/Users";
import EchoModel from "../../../../models/Echo";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectToDb();

  const page = Number(req.nextUrl.searchParams.get("page") || 1);
  const limit = 10;
  const skip = (page - 1) * limit;

  const echo = await EchoModel.find({ isAccept: false })
    .populate("user", "userName")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await EchoModel.countDocuments({ isAccept: false });

  return NextResponse.json({ echo, total });
}

export const POST = async (req) => {
  const body = await req.json();
  const { message } = body;
  console.log(message);

  try {
    await connectToDb();
    const token = await cookies().get("accessToken")?.value;

    if (!token)
      return NextResponse.json({ message: "توکن ارسال نشده" }, { status: 401 });

    const payload = await verifyAccessToken(token);
    if (!payload)
      return NextResponse.json(
        { message: "توکن نامعتبر است" },
        { status: 403 }
      );
    const user = await UserModel.findById(payload.id);
    console.log(payload);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await EchoModel.create({
      user: user._id,
      message,
      isAccept: false,
    });
    return NextResponse.json({ success: "با موفقبت ثبت شد." }, { status: 200 });
  } catch (err) {
    console.log(err);

    return Response.json({ message: err }, { status: 500 });
  }
};
