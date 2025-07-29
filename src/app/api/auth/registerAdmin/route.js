import { NextResponse } from "next/server";
import connectToDb from "../../../../../configs/db";
import { generateAdminToken, generateRefreshAdminToken, hashedPass, validatePassword, validatePhone } from "@/utils/auth";
import AdminModel from "../../../../../models/Admin";
import UserModel from "../../../../../models/Users";

export const POST = async (req) => {
  await connectToDb();
  try {
    const body = await req.json();
    const { gameNet, code, password, phone } = body;

    
    const AdminCode = ["45652585", "12325262"];
    
    if (!code || !password || !phone || !gameNet) {
      return NextResponse.json(
        { error: "لطفاً همه فیلدها را پر کنید" },
        { status: 400 }
      );
    }
    
    const isAdminExist = await AdminModel.findOne({phone});
    const isUserExist = await UserModel.findOne({phone});
    
     if (isAdminExist) {
      return NextResponse.json(
        { error: "این شماره تماس قبلاً استفاده شده است" },
        { status: 409 }
      );
    }
    if (isUserExist) {
      return NextResponse.json(
        { error: "این شماره تماس قبلاً با نقش کاربر وارد شده است ." },
        { status: 411 }
      );
    }



    const isValidPass = await validatePassword(password);
    const isValidPhone = await validatePhone(phone);

    if (!isValidPass) {
      return NextResponse.json(
        {
          error:
            "رمز عبور معتبر نیست. باید شامل یک حرف بزرگ انگلیسی، یک عدد و یک نماد باشد.",
        },
        { status: 408 }
      );
    }
    if (!isValidPhone) {
      return NextResponse.json(
        { error: "شماره تماس اشتباه است" },
        { status: 407 }
      );
    }

    
    
    const isValidCode = AdminCode.includes(code);
    if (!isValidCode) {
      return NextResponse.json({ error: "کد نامعتبر است" },
        { status: 410 });
    }


    const hashedPassword = await hashedPass(password); 

    const admin = await AdminModel.create({
      gameNet,
      code,
      password: hashedPassword,
      phone,
    });
    
    
    const savedAdmin = await admin.save();

    const accessToken = await generateAdminToken(savedAdmin);
    const refreshToken = await generateRefreshAdminToken(savedAdmin);

    const res = NextResponse.json({
      message: "ثبت‌نام موفقیت‌آمیز بود",
      accessToken,
      status: 200,
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
