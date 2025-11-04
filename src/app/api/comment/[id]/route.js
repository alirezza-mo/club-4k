import { NextResponse } from "next/server";
import connectToDb from "@/configs/db";
import Comment from "@/models/Comment";
import { verifyAccessToken } from "@/utils/auth";
import { cookies } from "next/headers";

export async function DELETE(req, { params }) {
  try {
    await connectToDb();
    const token = cookies().get("accessToken")?.value;
    if (!token) return NextResponse.json({ message: "توکن ارسال نشده" }, { status: 401 });

    const payload = verifyAccessToken(token);
    if (!payload) return NextResponse.json({ message: "توکن نامعتبر" }, { status: 403 });

    const { id } = params;
    const comment = await Comment.findById(id);
    if (!comment) return NextResponse.json({ message: "جمله یافت نشد" }, { status: 404 });

    // only owner can delete
    if (comment.user.toString() !== payload.id.toString()) {
      return NextResponse.json({ message: "دسترسی غیرمجاز" }, { status: 403 });
    }

    await Comment.findByIdAndDelete(id);
    return NextResponse.json({ message: "حذف شد" });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
