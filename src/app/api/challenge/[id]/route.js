import { NextResponse } from "next/server";
import connectToDb from "../../../../../configs/db";
import { verifyAccessToken } from "@/utils/auth";
import Challenge from "../../../../../models/Challenge";
import UsersModel from "../../../../../models/Users";
import { cookies } from "next/headers";

export async function DELETE(req, { params }) {
  try {
    await connectToDb();
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: "شناسه چالش ارسال نشده" },
        { status: 400 }
      );
    }
    const challenge = await Challenge.findById(id);
    if (!challenge) {
      return NextResponse.json({ error: "چالش یافت نشد" }, { status: 404 });
    }
    const token = await cookies().get("accessToken")?.value;
    if (!token) {
      return NextResponse.json({ error: "توکن ارسال نشده" }, { status: 401 });
    }
    let payload = await verifyAccessToken(token);
    if (!payload) {
      return NextResponse.json({ error: "توکن نامعتبر" }, { status: 401 });
    }
    const userId = payload.id;
    const user = await UsersModel.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }

    if (challenge.status === "pending") {
      await Challenge.deleteOne({ _id: id });
      return NextResponse.json(
        { message: "چالش با موفقیت لغو شد" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "چالش با موفقیت لغو شد" },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
export async function PATCH(req, { params }) {
  try {
    await connectToDb();
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: "شناسه چالش ارسال نشده" },
        { status: 400 }
      );
    }
    const challenge = await Challenge.findById(id);
    if (!challenge) {
      return NextResponse.json({ error: "چالش یافت نشد" }, { status: 404 });
    }
    const token = await cookies().get("accessToken")?.value;
    if (!token) {
      return NextResponse.json({ error: "توکن ارسال نشده" }, { status: 401 });
    }
    let payload = await verifyAccessToken(token);
    if (!payload) {
      return NextResponse.json({ error: "توکن نامعتبر" }, { status: 401 });
    }
    const userId = payload.id;
    const user = await UsersModel.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }
    if (challenge.status === "pending") {
      challenge.status = "accepted";
      await challenge.save();
    }
    return NextResponse.json({ message: "چالش پذیرفته شد" }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
