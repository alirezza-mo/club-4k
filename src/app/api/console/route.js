import { NextResponse } from "next/server";
import connectToDb from "../../../../configs/db";
import Console from "../../../../models/Console";

export async function GET() {
  try {
    await connectToDb();
    const consoles = await Console.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ consoles });
  } catch (err) {
    return NextResponse.json(
      { message: "خطای داخلی سرور", error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectToDb();
    const body = await req.json();
    const { name, barcode, location } = body || {};

    if (!name || !barcode) {
      return NextResponse.json(
        { message: "فیلدهای name و barcode الزامی هستند" },
        { status: 400 }
      );
    }

    const exists = await Console.findOne({ barcode });
    if (exists) {
      return NextResponse.json(
        { message: "برای این بارکد قبلاً کنسولی ثبت شده است" },
        { status: 409 }
      );
    }

    const consoleDevice = await Console.create({ name, barcode, location });
    return NextResponse.json({ console: consoleDevice }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { message: "خطای داخلی سرور", error: err.message },
      { status: 500 }
    );
  }
}


