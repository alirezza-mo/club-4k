import { verifyAccessToken } from "@/utils/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import AdminModel from "../../../../../models/Admin";

export async function DELETE() {
  const cookies = await cookies();
  const token = cookies.get("accessToken")?.value;

  if (!token) {
    return NextResponse.json({ status: 401 }, { message: "توکنی وجود ندارد" });
  }

  const payload = await verifyAccessToken(token);
  if (!payload) {
    return NextResponse.json({ status: 402 }, { message: "توکنی وجود ندارد" });
  }

  const adminId = payload._id;

  try{
      const deleteAdmin = await AdminModel.findByIdAndDelete({ adminId });
  const response = NextResponse.json({ message: "Logged out successfully" });

  response.cookies.set("accessToken", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    expires: new Date(0),
  });

  response.cookies.set("refreshToken", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    expires: new Date(0),
  });

   NextResponse.json(
      { message: "اکانت با موفقیت حذف شد" },
      { status: 200 }
    );

  }catch(err){
    console.error("حذف کاربر ناموفق بود:", err);
    return NextResponse.json(
      { message: "خطا در حذف کاربر" },
      { status: 500 }
    );
  }
  return response;
}
