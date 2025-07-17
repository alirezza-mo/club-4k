import { NextResponse } from "next/server";
import connectToDb from "../../../../../configs/db";
import { generateToken, verifyRefreshToken } from "@/utils/auth";
import UsersModel from "../../../../../models/Users";

export async function POST(req) {
  await connectToDb();

  const cookies = req.cookies;
  const token = cookies.get("refreshToken")?.value;

  if (!token) {
    return NextResponse.json({ error: "رفرش توکن یافت نشد" }, { status: 401 });
  }

  try {
    const payload = verifyRefreshToken(token);

    const user = await UsersModel.findOne({ userName: payload.userName });

    if (!user) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }

    const savedUser = await user.save();

    const newAccessToken = await generateToken(savedUser);

    const response = NextResponse.json({
      success: true,
      message: "اکسس توکن جدید ساخته شد",
      user: {
        id: user._id,
        userName: user.userName,
      },
    });
    response.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 15, // ۱۵ دقیقه
    });

    return response;
    
  } catch (err) {
    console.log(err);

    return NextResponse.json(
      { error: "توکن نامعتبر است" },
      { status: 400 },
      { mse: err }
    );
  }
}
