import { validatePhone } from "@/utils/auth";
import connectToDb from "../../../../../../configs/db";
import { NextResponse } from "next/server";
import UserModel from "../../../../../../models/Users";
import Otp from "../../../../../../models/Otp";
import axios from "axios";

export const POST = async (req) => {
  const body = await req.json();
  const { phone } = body;
  try {
    await connectToDb();
    const isValidPhone = validatePhone(phone);
    if (!isValidPhone) {
      return NextResponse.json(
        { status: 402 },
        { msg: "phone in not valid ..." }
      );
    }
    const user = await UserModel.findOne({ phone });
   
    if (!user) {
     return NextResponse.json(
        { error: "این نام کاربری وجود ندارد." },
        { status: 404 }
      );
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);
    await Otp.deleteMany({ phone });
    await Otp.create({ phone, code, expiresAt });

    await axios.post(
      "https://api.sms.ir/v1/send/verify",
      {
        mobile: phone,
        templateId: process.env.SMS_TEMPLATE_ID,
        parameters: [{ name: "CODE", value: code }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "text/plain",
          "x-api-key": process.env.SMS_API_KEY,
        },
      }
    );

    return NextResponse.json({ success: true, status: 201, message: "ok" });
  } catch (err) {
    console.error("ارسال پیامک ناموفق:", err?.response?.data || err.message);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "خطا در ارسال پیامک",
        error: err.message,
      }),
      { status: 500 }
    );
  }
};
