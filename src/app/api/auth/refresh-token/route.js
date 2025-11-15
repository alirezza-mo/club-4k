import { NextResponse } from "next/server";
import connectToDb from "../../../../../configs/db";
import { generateToken, verifyRefreshToken, generateRefreshToken, generateAdminToken, generateRefreshAdminToken } from "@/utils/auth";
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
    let newRefreshToken = null;

    // try user first
    if (payload.userName) {
      const user = await UsersModel.findOne({ userName: payload.userName });
      if (!user) return NextResponse.json({ error: "کاربر پیدا نشد" }, { status: 404 });
      accessToken = await generateToken(user);
      newRefreshToken = generateRefreshToken(user);
    } else if (payload.gameNet || payload.id) {
      // admin payload includes gameNet and id
      const admin = payload.id ? await AdminModel.findById(payload.id) : await AdminModel.findOne({ gameNet: payload.gameNet });
      if (!admin) return NextResponse.json({ error: "ادمین پیدا نشد" }, { status: 404 });
      accessToken = await generateAdminToken(admin);
      newRefreshToken = generateRefreshAdminToken(admin);
    } else {
      return NextResponse.json({ error: "پِلِی‌لود توکن نامشخص است" }, { status: 400 });
    }

    const response = NextResponse.json({ success: true, message: "اکسس توکن جدید ساخته شد" });

    // set new access token cookie
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 15,
    });

    // rotate refresh token as well
    if (newRefreshToken) {
      response.cookies.set("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 15 * 24 * 60 * 60,
      });
    }

    return response;
  } catch (err) {
    console.error("خطا در بررسی توکن:", err);
    return NextResponse.json({ error: "توکن نامعتبر است" }, { status: 400 });
  }
}
