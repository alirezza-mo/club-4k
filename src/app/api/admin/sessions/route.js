import { NextResponse } from "next/server";
import connectToDb from "../../../../../configs/db";
import GameSession from "../../../../../models/GameSession";
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
    const status = req.nextUrl.searchParams.get("status") || "all"; // active, ended, all

    const filter = {};
    if (scope !== "global") {
      filter['console.location'] = admin.gameNet; // we'll populate and filter in-memory
    }
    if (status === "active") filter.status = "active";
    if (status === "ended") filter.status = "ended";

    // get sessions and populate console & players
    let sessions = await GameSession.find({}).populate("console").populate("player1").populate("player2").lean();

    if (scope !== "global") {
      sessions = sessions.filter((s) => s.console && s.console.location === admin.gameNet);
    }
    if (status === "active") sessions = sessions.filter((s) => s.status === "active");
    if (status === "ended") sessions = sessions.filter((s) => s.status === "ended");

    return NextResponse.json({ sessions });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
