// import connectToDb from "../../../../../configs/db";
import Admin from "../../../../../../models/Admin";
import Console from "../../../../../../models/Console";
import GameSession from "../../../../../../models/GameSession";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
// import { verifyAccessToken } from "@/utils/auth";
import connectToDb from "../../../../../../configs/db";
import { verifyAccessToken } from "@/utils/auth";

function startOfCurrentPersianWeek() {
  const now = new Date();
  // JS: 0=Sun,1=Mon,...6=Sat. We want week starting Saturday (6).
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const day = today.getDay();
  // daysBack: how many days to subtract to reach Saturday
  const daysBack = (day - 6 + 7) % 7;
  today.setDate(today.getDate() - daysBack);
  today.setHours(0, 0, 0, 0);
  return today;
}

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
    if (!admin) return NextResponse.json({ error: "ادمین یافت نشد" }, { status: 403 });

    const scope = req.nextUrl.searchParams.get("scope") || "local";

    const start = startOfCurrentPersianWeek();

    let match = { createdAt: { $gte: start } };

    if (scope === "local") {
      // find consoles for this gameNet
      const consoles = await Console.find({ location: admin.gameNet }).select("_id");
      const consoleIds = consoles.map((c) => c._id);
      if (consoleIds.length === 0) {
        // no consoles -> all zero
        return NextResponse.json({ dataPerDay: [0, 0, 0, 0, 0, 0, 0], scope: "local", gameNet: admin.gameNet });
      }
      match.console = { $in: consoleIds };
    }

    // aggregate by dayOfWeek (Mongo: 1=Sunday .. 7=Saturday)
    const agg = await GameSession.aggregate([
      { $match: match },
      { $group: { _id: { $dayOfWeek: "$createdAt" }, count: { $sum: 1 } } },
    ]);

    const counts = [0, 0, 0, 0, 0, 0, 0];
    for (const row of agg) {
      const mongoDay = Number(row._id); // 1..7 (Sun..Sat)
      const idx = mongoDay % 7; // maps 7->0 (Sat), 1->1 (Sun), ..., 6->6 (Fri)
      counts[idx] = row.count;
    }

    return NextResponse.json({ dataPerDay: counts, scope, gameNet: admin.gameNet });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
