// import connectToDb from "../../../../../configs/db";
import Users from "../../../../../../models/Users";
import Admin from "../../../../../../models/Admin";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/utils/auth";
import connectToDb from "../../../../../../configs/db";

function monthRangesForYear(year) {
  const ranges = [];
  for (let m = 0; m < 12; m++) {
    const start = new Date(year, m, 1);
    const end = new Date(year, m + 1, 1);
    ranges.push({ start, end });
  }
  return ranges;
}

export async function GET(req) {
  try {
    await connectToDb();

    const scope = req.nextUrl.searchParams.get("scope") || "local";
    const yearParam = Number(req.nextUrl.searchParams.get("year")) || new Date().getFullYear();

    // require admin
    const token = cookies().get("accessToken")?.value;
    if (!token) return NextResponse.json({ error: "توکن ارسال نشده" }, { status: 401 });

    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch (err) {
      return NextResponse.json({ error: "توکن نامعتبر" }, { status: 401 });
    }

    const admin = await Admin.findById(payload.id);
    if (!admin) return NextResponse.json({ error: "ادمین یافت نشد" }, { status: 403 });

    const ranges = monthRangesForYear(yearParam);

    const results = [];

    if (scope === "global") {
      for (const r of ranges) {
        const count = await Users.countDocuments({ createdAt: { $gte: r.start, $lt: r.end } });
        results.push(count);
      }
    } else {
      // local: only users for this admin's gameNet
      for (const r of ranges) {
        const count = await Users.countDocuments({ gameNet: admin.gameNet, createdAt: { $gte: r.start, $lt: r.end } });
        results.push(count);
      }
    }

    return NextResponse.json({ year: yearParam, months: results, scope, gameNet: admin.gameNet });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
