// app/api/contact/[id]/route.js
import { NextResponse } from "next/server";
import Contact from "../../../../../models/Contact";
import connectToDb from "../../../../../configs/db";

export async function DELETE(req, { params }) {
  try {
    await connectToDb();
    const deleted = await Contact.findByIdAndDelete(params.id);
    if (!deleted)
      return NextResponse.json({ message: "پیام یافت نشد." }, { status: 404 });

    return NextResponse.json({ message: "پیام با موفقیت حذف شد." });
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json({ message: "خطای سرور در حذف پیام." }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    await connectToDb();
    const { isRead } = await req.json();

    const updated = await Contact.findByIdAndUpdate(
      params.id,
      { isRead },
      { new: true }
    );

    if (!updated)
      return NextResponse.json({ message: "پیام یافت نشد." }, { status: 404 });

    return NextResponse.json({ message: "وضعیت پیام به‌روزرسانی شد.", data: updated });
  } catch (error) {
    console.error("Error updating message:", error);
    return NextResponse.json({ message: "خطای سرور در به‌روزرسانی پیام." }, { status: 500 });
  }
}
