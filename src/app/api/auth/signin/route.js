import { NextResponse } from "next/server";
import { generateRefreshToken, generateToken, hashedPass, validatePassword, validatePhone } from "@/utils/auth";
import connectToDb from "../../../../../configs/db";
import UsersModel from "../../../../../models/Users";
import Otp from "../../../../../models/Otp";

export const POST = async (req) => {
  await connectToDb();
  try {
    const body = await req.json();
    const { userName, phone, password, confirmPassword, gameNet, otp } = body;

    // چک فیلدها
    if (!userName || !password || !confirmPassword || !phone || !gameNet) {
      return NextResponse.json(
        { error: "لطفاً همه فیلدها را پر کنید" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "رمز عبور و تکرار آن یکسان نیستند" },
        { status: 401 }
      );
    }
    
    const isValidPass = await validatePassword(password)
    const isValidPhone = await validatePhone(phone)

    if(!isValidPass){
      return NextResponse.json(
        {error : "رمز عبور معتبر نیست. باید شامل یک حرف بزرگ انگلیسی، یک عدد و یک نماد باشد."} ,
        {status : 408}
      )
    }
    if(!isValidPhone){
      return NextResponse.json(
        {error : "شماره تماس اشتباه است"} ,
        { status : 407 }
      )
    }

    // چک وجود کاربر
    const isUserExist = await UsersModel.findOne({
      $or: [{ userName }, { phone }],
    });
    if (isUserExist) {
      return NextResponse.json(
        { error: "این نام کاربری قبلاً استفاده شده است" },
        { status: 409 }
      );
    }

    // بررسی کد OTP
    const record = await Otp.findOne({ phone });
    if (!record) {
      return NextResponse.json(
        { error: "کدی برای این شماره ارسال نشده" },
        { status: 410 }
      );
    }

    if (new Date() > record.expiresAt) {
      await Otp.deleteOne({ phone });
      return NextResponse.json(
        { error: "کد منقضی شده است" },
        { status: 405 }
      );
    }

    if (record.code !== otp) {
      return NextResponse.json({ error: "کد اشتباه است" }, { status: 406 });
    }

    // ایجاد کاربر جدید
    const hashedPassword = await hashedPass(password);
    const user = await UsersModel.create({
      userName,
      phone,
      password: hashedPassword,
      gameNet,
    });

    const savedUser = await user.save();


    // تولید توکن‌ها
    const accessToken = await generateToken(savedUser);
    const refreshToken = await generateRefreshToken(savedUser);

    // ساخت پاسخ با کوکی
    const res = NextResponse.json({
      message: "ثبت‌نام موفقیت‌آمیز بود",
      accessToken,
    });

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
    console.error("Register error:", err);
    return NextResponse.json(
      { error: "مشکلی در ثبت‌نام پیش آمد", details: err.message },
      { status: 500 }
    );
  }
};
