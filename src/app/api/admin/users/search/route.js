import { NextResponse } from "next/server";
import connectToDb from "../../../../../../configs/db";
import Users from "../../../../../../models/Users";
import Admin from "../../../../../../models/Admin";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/utils/auth";

export async function GET(req) {
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

    const q = req.nextUrl.searchParams.get("q") || "";
    if (!q) return NextResponse.json({ users: [] });

    const regex = new RegExp(q, "i");
    const users = await Users.find({
      $or: [
        { phone: q },
        { userName: regex },
        { firstName: regex },
        { lastName: regex },
      ],
    })
      .limit(20)
      .select("_id userName firstName lastName phone gameNet isActive")
      .lean();

    return NextResponse.json({ users });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
