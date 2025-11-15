import { NextResponse } from "next/server";
import connectToDb from "../../../../../../models/Comment";
import Comment from "../../../../../../models/Comment";
import Admin from "../../../../../../models/Admin";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/utils/auth";

export async function PATCH(req, { params }) {
  const { commentId } = params;
  try {
    await connectToDb();
    const token = cookies().get("accessToken")?.value;
    if (!token) return NextResponse.json({ error: "توکن ارسال نشده" }, { status: 401 });

    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch (err) {
      return NextResponse.json({ error: "توکن نامعتبر" }, { status: 401 });
    }

    const admin = await Admin.findById(payload.id);
    if (!admin) return NextResponse.json({ error: "کاربر ادمین نیست" }, { status: 403 });

    const body = await req.json();
    const { isAccept } = body;
    if (typeof isAccept !== "boolean") return NextResponse.json({ error: "پارامتر isAccept لازم است" }, { status: 400 });

    const updated = await Comment.findByIdAndUpdate(commentId, { $set: { isAccept } }, { new: true }).lean();
    if (!updated) return NextResponse.json({ error: "کامنت یافت نشد" }, { status: 404 });

    return NextResponse.json({ comment: updated });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { commentId } = params;
  try {
    await connectToDb();
    const token = cookies().get("accessToken")?.value;
    if (!token) return NextResponse.json({ error: "توکن ارسال نشده" }, { status: 401 });

    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch (err) {
      return NextResponse.json({ error: "توکن نامعتبر" }, { status: 401 });
    }

    const admin = await Admin.findById(payload.id);
    if (!admin) return NextResponse.json({ error: "کاربر ادمین نیست" }, { status: 403 });

    const deleted = await Comment.findByIdAndDelete(commentId).lean();
    if (!deleted) return NextResponse.json({ error: "کامنت یافت نشد" }, { status: 404 });

    return NextResponse.json({ ok: true, deletedId: commentId });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
