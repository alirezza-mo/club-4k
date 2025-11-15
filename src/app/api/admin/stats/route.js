import connectToDb from "../../../../../configs/db";
import Users from "../../../../../models/Users";
import Admin from "../../../../../models/Admin";
import Ticket from "../../../../../models/Ticket";
import Challenge from "../../../../../models/Challenge";
import Comment from "../../../../../models/Comment";
import News from "../../../../../models/News";
import GameSession from "../../../../../models/GameSession";
import Console from "../../../../../models/Console";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/utils/auth";

export async function GET(req) {
  try {
    await connectToDb();

    const token = cookies().get("accessToken")?.value;
    if (!token) {
      return NextResponse.json({ error: "توکن ارسال نشده" }, { status: 401 });
    }

    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch (err) {
      return NextResponse.json({ error: "توکن نامعتبر" }, { status: 401 });
    }

    const admin = await Admin.findById(payload.id);
    if (!admin) {
      return NextResponse.json({ error: "کاربر ادمین نیست" }, { status: 403 });
    }
    const scope = req.nextUrl.searchParams.get("scope") || "local";

    if (scope === "global") {
      const [usersCount, adminsCount, ticketsCount, challengesCount, commentsCount, newsCount, sessionsCount] = await Promise.all([
        Users.countDocuments(),
        Admin.countDocuments(),
        Ticket.countDocuments(),
        Challenge.countDocuments(),
        Comment.countDocuments(),
        News.countDocuments(),
        GameSession.countDocuments(),
      ]);

      return NextResponse.json({
        users: usersCount,
        admins: adminsCount,
        tickets: ticketsCount,
        challenges: challengesCount,
        comments: commentsCount,
        news: newsCount,
        sessions: sessionsCount,
        gameNets: adminsCount,
      });
    }

    // local scope (game-net specific)
    // users belonging to this admin's gameNet (Users.gameNet is a string)
    const userDocs = await Users.find({ gameNet: admin.gameNet }).select("_id");
    const userIds = userDocs.map((u) => u._id);

    const consoleDocs = await Console.find({ location: admin.gameNet }).select("_id");
    const consoleIds = consoleDocs.map((c) => c._id);

    const [usersCount, adminsCount, challengesCount, newsCount] = await Promise.all([
      Users.countDocuments({ gameNet: admin.gameNet }),
      Admin.countDocuments({ gameNet: admin.gameNet }),
      Challenge.countDocuments({ location: admin._id }),
      News.countDocuments({ admin: admin._id }),
    ]);

    const ticketsCount = userIds.length ? await Ticket.countDocuments({ user: { $in: userIds } }) : 0;
    const commentsCount = userIds.length ? await Comment.countDocuments({ user: { $in: userIds } }) : 0;
    const sessionsCount = consoleIds.length ? await GameSession.countDocuments({ console: { $in: consoleIds } }) : 0;

    return NextResponse.json({
      users: usersCount,
      admins: adminsCount,
      tickets: ticketsCount,
      challenges: challengesCount,
      comments: commentsCount,
      news: newsCount,
      sessions: sessionsCount,
      gameNets: adminsCount,
      scope: "local",
      gameNet: admin.gameNet,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
