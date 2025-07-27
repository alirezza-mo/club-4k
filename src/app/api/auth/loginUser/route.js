import { NextResponse } from "next/server";
import connectToDb from "../../../../../configs/db";
import {
  comparePassword,
  generateRefreshToken,
  generateToken,
  validatePassword,
  validatePhone,
} from "@/utils/auth";
import UserModel from "../../../../../models/Users";

export const POST = async (req) => {
  const body = await req.json();
  const { phone, password } = body;

  try {
    await connectToDb();
    if (!phone || !password) {
      return NextResponse.json(
        { status: 400 },
        { message: "تمام آیتم ها پر شوند." }
      );
    }
    const isValidPassword = await validatePassword(password);
    const isValidPhone = await validatePhone(phone);
    if (!isValidPassword) {
      return NextResponse.json(
        { status: 401 },
        { message: "رمز عبور صحیح نمی باشد" }
      );
    }
    if (!isValidPhone) {
      return NextResponse.json(
        { status: 402 },
        { message: "شماره تماس به خوبی وارد نشده است." }
      );
    }
    const user = await UserModel.findOne({ phone });

    if (!user) {
      return Response.json(
        { message: "گیم نت / ادمین با این شماره یافت نشد" },
        { status: 404 }
      );
    }
    const comparePass = await comparePassword(user.password, password);

    if (!comparePass) {
      return Response.json(
        { message: "گیم نت / ادمین با این شماره یافت نشد" },
        { status: 403 }
      );
    }

    const savedUser = await user.save();

    const accessToken = await generateToken(savedUser);
    const refreshToken = await generateRefreshToken(savedUser);

    const res = NextResponse.json({ message: " خوش آمدید. " }, { status: 200 });

    res.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 15,
      path: "/",
    });

    res.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 24 * 60 * 60,
      path: "/",
    });
    return res;
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "خطای داخلی سرور", error: err.message },
      { status: 500 }
    );
  }
};
