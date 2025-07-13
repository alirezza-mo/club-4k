import { NextResponse } from "next/server";
import connectToDb from "../../../../../../configs/db";
import Otp from "../../../../../../models/Otp";
import Users from "../../../../../../models/Users";
import axios from "axios";

export async function POST(req) {
  await connectToDb();

  try {
    const { phone, userName } = await req.json();

    let isExistUser = await Users.findOne({
      $or: [{ userName }, { phone }],
    });

    if (isExistUser) {
      console.log(isExistUser);
      return NextResponse.json(
        { success: false, message: "bad" },
        { status: 401 }
      );
    }
    
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 دقیقه اعتبار
    
    // console.log(phone , code , expiresAt , userName , isExistUser , process.env.SMS_TEMPLATE_ID);
    await Otp.deleteMany({ phone });
    await Otp.create({ phone, code, expiresAt });

    // ارسال کد با sms.ir
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
          "x-api-key": process.env.SMS_API_KEY, // ✅ کلید درست
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
}
