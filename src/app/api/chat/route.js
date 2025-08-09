import { verifyAccessToken } from "@/utils/auth";
import { NextResponse } from "next/server";
import connectToDb from "../../../../configs/db";
import { cookies } from "next/headers";
import UserModel from "../../../../models/Users";
import AdminModel from "../../../../models/Admin";
import ChatModel from "../../../../models/Chat";

export async function POST(req) {
  try {
    await connectToDb();

    const token = await cookies().get("accessToken")?.value;
    if (!token) {
      return NextResponse.json({ message: "توکن وجود ندارد" }, { status: 401 });
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return NextResponse.json(
        { message: "توکن نامعتبر است" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { message: "اطلاعات ناقص است" },
        { status: 400 }
      );
    }

    let senderId = decoded.id;
    let senderModel;

    const user = await UserModel.findById(senderId);
    if (user) {
      senderModel = "Users";
    } else {
      const admin = await AdminModel.findById(senderId);
      if (admin) {
        senderModel = "Admin";
      } else {
        return NextResponse.json(
          { message: "فرستنده یافت نشد" },
          { status: 404 }
        );
      }
    }

    const newMessage = await ChatModel.create({
      sender: senderId,
      senderModel,
      message,
    });

    return NextResponse.json(
      { message: "پیام با موفقیت ارسال شد", data: newMessage },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "خطای سرور" }, { status: 500 });
  }
}
export async function GET() {
  try {
    await connectToDb();
    const messages = await ChatModel.find({}).populate('sender', 'userName gameNet role').sort({ createdAt: -1 });
    console.log(messages);
    
    return NextResponse.json({ messages }, { status: 200 });
  } catch (err) {
    console.log(err);
  }
}
