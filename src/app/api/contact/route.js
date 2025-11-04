// app/api/contact/route.js
import { NextResponse } from "next/server";
import Contact from "../../../../models/Contact";
import connectToDb from "../../../../configs/db";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, title, message } = body;

    if (!name || !email || !title || !message) {
      return NextResponse.json({ message: "تمام فیلدها الزامی هستند." }, { status: 400 });
    }

    await connectToDb();

    const newMessage = await Contact.create({ name, email, title, message });

    return NextResponse.json(
      { message: "پیام شما با موفقیت ثبت شد.", data: newMessage },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in contact route:", error);
    return NextResponse.json({ message: "خطایی در سرور رخ داد." }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDb();
    const messages = await Contact.find().sort({ createdAt: -1 });
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ message: "خطا در دریافت پیام‌ها" }, { status: 500 });
  }
}
