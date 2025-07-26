// app/api/auth/me/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/utils/auth";
import User from "../../../../../models/Users";
import Admin from "../../../../../models/Admin";
import connectToDb from "../../../../../configs/db";

export async function GET() {
  await connectToDb();

  const token = (await cookies()).get("accessToken")?.value;

  if (!token) {
    return NextResponse.json({ message: "access token نیست" }, { status: 401 });
  }

  const payload = verifyAccessToken(token);
  if (!payload) {
    return NextResponse.json({ message: "توکن نامعتبر" }, { status: 401 });
  }

  const user = await User.findById(payload.id).select("-password");
  const admin = await Admin.findById(payload.id).select("-password");
  if (user) {
    return NextResponse.json(user);
  }
  if (admin) {
    return NextResponse.json(admin);
  }

   return NextResponse.json({ message: "کاربری با این توکن یافت نشد" }, { status: 404 });
}
