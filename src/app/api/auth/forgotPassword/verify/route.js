import { NextResponse } from "next/server";
import connectToDb from "../../../../../../configs/db";
import Otp from "../../../../../../models/Otp";

export const POST = async (req) => {
  const body = await req.json();
  const { code , phone } = body;
  try {
    await connectToDb();
    const record = await Otp.findOne({ phone });
    if (!record) {
      return NextResponse.json(
        { error: "کدی برای این شماره ارسال نشده" },
        { status: 410 }
      );
    }

    if (new Date() > record.expiresAt) {
      await Otp.deleteOne({ phone });
      return NextResponse.json({ error: "کد منقضی شده است" }, { status: 405 });
    }
    console.log(record.code , code);
    
    if (record.code !== code) {
      return NextResponse.json({ error: "کد اشتباه است" }, { status: 406 });
    }
    return NextResponse.json({status : 200} , {msg : "کد صحیح میباشد"})
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
