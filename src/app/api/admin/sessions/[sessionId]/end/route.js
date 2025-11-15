import { NextResponse } from "next/server";
import connectToDb from "../../../../../../../configs/db";
import GameSession from "../../../../../../../models/GameSession";
import Console from "../../../../../../../models/Console";
import Admin from "../../../../../../../models/Admin";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/utils/auth";

export async function POST(req, { params }) {
  const { sessionId } = params;
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

    const sessionDoc = await GameSession.findById(sessionId);
    if (!sessionDoc) return NextResponse.json({ error: "جلسه یافت نشد" }, { status: 404 });

    if (sessionDoc.status === "ended") return NextResponse.json({ error: "جلسه قبلاً به پایان رسیده" }, { status: 400 });

    sessionDoc.endedAt = new Date();
    sessionDoc.status = "ended";
    if (sessionDoc.startedAt) {
      sessionDoc.durationSeconds = Math.floor((sessionDoc.endedAt - sessionDoc.startedAt) / 1000);
    }
    await sessionDoc.save();

    // update console
    if (sessionDoc.console) {
      const consoleDoc = await Console.findById(sessionDoc.console);
      if (consoleDoc) {
        consoleDoc.status = "idle";
        consoleDoc.currentSession = null;
        await consoleDoc.save();
      }
    }

    const populated = await GameSession.findById(sessionDoc._id).populate("console").populate("player1").populate("player2").lean();
    return NextResponse.json({ session: populated });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
