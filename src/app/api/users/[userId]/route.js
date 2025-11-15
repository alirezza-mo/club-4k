import { NextResponse } from "next/server";
import connectToDb from "../../../../../configs/db";
import UserModel from "../../../../../models/Users";
import Admin from "../../../../../models/Admin";
import { cookies } from "next/headers";
import { verifyAccessToken, validatePhone, hashedPass } from "@/utils/auth";
import crypto from "crypto";

export async function GET(req, { params }) {
  const { userId } = params;
  try {
    await connectToDb();
    const user = await UserModel.findById(userId).lean();
    if (!user) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Admin-only update
export async function PUT(req, { params }) {
  const { userId } = params;
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
    // Accept { name, phone, status, promote } from client
    const { name, phone, status, promote } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "نام کامل کاربر لازم است" }, { status: 400 });
    }

    if (phone && !validatePhone(phone)) {
      return NextResponse.json({ error: "شماره تماس نامعتبر است" }, { status: 400 });
    }

    const [firstName, ...rest] = (name || "").trim().split(" ");
    const lastName = rest.join(" ") || "";
    const isActive = status === "فعال";

    const updated = await UserModel.findByIdAndUpdate(
      userId,
      { $set: { firstName, lastName, phone, isActive } },
      { new: true }
    ).lean();

    if (!updated) return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });

    // if promote requested, create an Admin record (if not exists)
    if (promote) {
      // Do not create duplicate admin for same phone+gameNet
      const existing = await Admin.findOne({ phone: updated.phone, gameNet: updated.gameNet });
      if (!existing) {
        const randomPassword = crypto.randomBytes(8).toString("hex");
        const hashed = await hashedPass(randomPassword);
        const code = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
        const adminDoc = new Admin({ gameNet: updated.gameNet || updated.gameNet, code, password: hashed, phone: updated.phone });
        await adminDoc.save();
        return NextResponse.json({ updated, admin: { id: adminDoc._id, code } });
      } else {
        return NextResponse.json({ updated, admin: { id: existing._id, note: "already_exists" } });
      }
    }

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Admin-only delete
export async function DELETE(req, { params }) {
  const { userId } = params;
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

    const deleted = await UserModel.findByIdAndDelete(userId).lean();
    if (!deleted) return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });

    return NextResponse.json({ ok: true, deletedId: userId });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}