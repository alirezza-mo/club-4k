import { NextResponse } from "next/server";
import connectToDb from "../../../../../configs/db";
import { generateToken, verifyRefreshToken } from "@/utils/auth";
import UsersModel from "../../../../../models/Users";
import AdminModel from "../../../../../models/Admin";

export async function POST(req) {
  await connectToDb();

  const cookies = req.cookies;
  const token = cookies.get("refreshToken")?.value;

  if (!token) {
    return NextResponse.json({ error: "رفرش توکن یافت نشد" }, { status: 401 });
  }

  try {
    const payload = verifyRefreshToken(token);
    let accessToken = null;

    const user = await UsersModel.findOne({ userName: payload.userName });

    if (user) {
      accessToken = await generateToken(user);
    } else {
      const admin = await AdminModel.findOne({ gameNet: payload.gameNet });

      if (admin) {
        accessToken = await generateToken(admin);
      } else {
        return NextResponse.json({ error: "کاربر یا ادمین یافت نشد" }, { status: 404 });
      }
    }

    const response = NextResponse.json({
      success: true,
      message: "اکسس توکن جدید ساخته شد",
    });

    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 15, // ۱۵ دقیقه
    });

    return response;
  } catch (err) {
    console.error("خطا در بررسی توکن:", err);
    return NextResponse.json(
      { error: "توکن نامعتبر است" },
      { status: 400 }
    );
  }
}
