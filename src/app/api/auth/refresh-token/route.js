import { NextResponse } from "next/server";
import connectToDb from "../../../../../configs/db";
import { generateToken, verifyRefreshToken } from "@/utils/auth";
import UsersModel from "../../../../../models/Users"



export async function POST(req) {
  await connectToDb();

  const cookies = req.cookies;
  const token = cookies.get("refreshToken")?.value;

  console.log(token);
  
  
  if (!token) {
    return NextResponse.json({ error: "رفرش توکن یافت نشد" }, { status: 401 });
  }

  try {
    const payload = verifyRefreshToken(token);

    const user = await UsersModel.findOne(payload.id);
    console.log(payload);
    
    if (!user) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }

    const newAccessToken = generateToken(user.id);

    return NextResponse.json({
      accessToken: newAccessToken,
      user: {
        id: user._id,
        userName: user.userName,
      },
    });

  } catch (err) {
    return NextResponse.json({ error: "توکن نامعتبر است" }, { status: 403 });
  }
}
