import { NextResponse } from "next/server";
import connectToDb from "../../../../../../configs/db";
import GameSession from "../../../../../../models/GameSession";
import Console from "../../../../../../models/Console";
import Users from "../../../../../../models/Users";
import Admin from "../../../../../../models/Admin";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/utils/auth";

export async function POST(req) {
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

    const body = await req.json();
    const { consoleId, player1Identifier, player2Identifier } = body || {};
    if (!consoleId || !player1Identifier || !player2Identifier) {
      return NextResponse.json({ error: "پارامترهای لازم ارسال نشده" }, { status: 400 });
    }

    // ensure console exists and is idle and belongs to admin's gameNet
    const consoleDoc = await Console.findById(consoleId);
    if (!consoleDoc) return NextResponse.json({ error: "کنسول یافت نشد" }, { status: 404 });
    if (consoleDoc.location && consoleDoc.location !== admin.gameNet) return NextResponse.json({ error: "کنسول متعلق به این گیم‌نت نیست" }, { status: 403 });
    if (consoleDoc.status === "busy") return NextResponse.json({ error: "کنسول هم‌اکنون در حال استفاده است" }, { status: 409 });

    // helper to find user by id or username or phone
    const findUser = async (ident) => {
      if (!ident) return null;
      if (/^[0-9a-fA-F]{24}$/.test(ident)) {
        const u = await Users.findById(ident);
        if (u) return u;
      }
      const byPhone = await Users.findOne({ phone: ident });
      if (byPhone) return byPhone;
      const byUser = await Users.findOne({ userName: ident });
      if (byUser) return byUser;
      // try name search
      const parts = ident.trim().split(" ");
      const q = { firstName: parts[0] };
      const byName = await Users.findOne(q);
      return byName;
    };

    const player1 = await findUser(player1Identifier);
    const player2 = await findUser(player2Identifier);
    if (!player1 || !player2) return NextResponse.json({ error: "یکی از بازیکنان یافت نشد" }, { status: 404 });

    // Ensure both players belong to same gameNet as console (if set)
    if (consoleDoc.location) {
      if (player1.gameNet && player1.gameNet !== consoleDoc.location) return NextResponse.json({ error: "بازیکن 1 در این گیم‌نت نیست" }, { status: 403 });
      if (player2.gameNet && player2.gameNet !== consoleDoc.location) return NextResponse.json({ error: "بازیکن 2 در این گیم‌نت نیست" }, { status: 403 });
    }

    // create session
    const session = new GameSession({
      console: consoleDoc._id,
      player1: player1._id,
      player2: player2._id,
      status: "active",
      startedAt: new Date(),
    });
    await session.save();

    // update console
    consoleDoc.status = "busy";
    consoleDoc.currentSession = session._id;
    await consoleDoc.save();

    const populated = await GameSession.findById(session._id).populate("console").populate("player1").populate("player2").lean();
    return NextResponse.json({ session: populated });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
