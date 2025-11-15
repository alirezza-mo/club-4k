import { NextResponse } from "next/server";
import connectToDb from "../../../../../configs/db";
import Console from "../../../../../models/Console";
import Admin from "../../../../../models/Admin";
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

    const scope = req.nextUrl.searchParams.get("scope") || "local";
    const filter = scope === "global" ? {} : { location: admin.gameNet };

    const consoles = await Console.find(filter).lean();
    return NextResponse.json({ consoles });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
