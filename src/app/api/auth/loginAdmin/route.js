import {
  comparePassword,
  generateAdminToken,
  generateRefreshAdminToken,
} from "@/utils/auth";
import connectToDb from "../../../../../configs/db";
import AdminModel from "../../../../../models/Admin";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  const body = await req.json();
  const { phone, code, password } = body;
  
  try {
    await connectToDb();

    if (!code || !password || !phone) {
      return NextResponse.json(
        { error: "لطفاً همه فیلدها را پر کنید" },
        { status: 400 }
      );
    }
    const admin = await AdminModel.findOne({ $or: [{ phone }, { code }] });
    
    if (!admin) {
      return Response.json(
        { message: "گیم نت / ادمین با این شماره یافت نشد" },
        { status: 404 }
      );
    }
    const isPasswordCorrect = await comparePassword(admin.password, password);
    if (!isPasswordCorrect) {
      return Response.json({ message: "رمز عبور اشتباه است" }, { status: 401 });
    }
    if(code !== admin.code){
      return Response.json({ message: " کد شناسایی اشتباه است" }, { status: 402 });
    }
    const accessToken = await generateAdminToken(admin);
    const refreshToken = await generateRefreshAdminToken(admin);

    const res = NextResponse.json(
      { message: "گیم نت / ادمین با موفقیت عضو شد." },
      { status: 200 } ,
      {accessToken}
    );

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
    return res
  } catch (err) {
    console.log(err);
  }
};
