// app/api/auth/me/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/utils/auth";
import User from "../../../../../models/Users";
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

  console.log(payload);

  const user = await User.findById(payload.id).select("-password");
  if (!user) {
    return NextResponse.json({ message: "کاربر یافت نشد" }, { status: 404 });
  }

  return NextResponse.json({ user });
}
