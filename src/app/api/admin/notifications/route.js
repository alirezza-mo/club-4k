// import connectToDb from "../../../../../configs/db";
import Admin from "../../../../../models/Admin";
import Users from "../../../../../models/Users";
import Ticket from "../../../../../models/Ticket";
import Challenge from "../../../../../models/Challenge";
import Comment from "../../../../../models/Comment";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/utils/auth";
import connectToDb from "../../../../../configs/db";

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

    // find user ids in this gameNet
    const users = await Users.find({ gameNet: admin.gameNet }).select("_id userName createdAt");
    const userIds = users.map((u) => u._id);

    // recent tickets for these users
    const tickets = await Ticket.find({ user: { $in: userIds } })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // recent challenges at this location (where location == admin._id)
    const challenges = await Challenge.find({ location: admin._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('inviter invited', 'userName')
      .lean();

    // recent comments (unaccepted) involving these users
    const comments = await Comment.find({ user: { $in: userIds } })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'userName')
      .lean();

    // recent registrations (new users in gameNet)
    const recentUsers = users
      .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0,5);

    const notifications = [];

    // map tickets
    for (const t of tickets) {
      notifications.push({
        id: `ticket-${t._id}`,
        type: 'ticket',
        message: `تیکت جدید: ${t.title}`,
        time: t.createdAt,
        link: `/p-admin/tickets/${t._id}`,
      });
    }

    // map challenges
    for (const c of challenges) {
      const inviter = c.inviter?.userName || 'کاربر';
      const invited = c.invited?.userName || '';
      notifications.push({
        id: `challenge-${c._id}`,
        type: 'challenge',
        message: `چلنج جدید: ${inviter} vs ${invited}`,
        time: c.createdAt,
        link: `/p-admin/challenges/${c._id}`,
      });
    }

    // map comments
    for (const cm of comments) {
      notifications.push({
        id: `comment-${cm._id}`,
        type: 'comment',
        message: `کامنت از ${cm.user?.userName || 'کاربر'}`,
        time: cm.createdAt,
        link: `/p-admin/comments/${cm._id}`,
      });
    }

    // map new users
    for (const u of recentUsers) {
      notifications.push({
        id: `user-${u._id}`,
        type: 'user',
        message: `کاربر جدید ثبت‌نام کرد: ${u.userName}`,
        time: u.createdAt,
        link: `/p-admin/users/${u._id}`,
      });
    }

    // sort notifications by time desc and take top 10
    notifications.sort((a,b) => new Date(b.time) - new Date(a.time));
    const top = notifications.slice(0, 10);

    return NextResponse.json({ notifications: top, gameNet: admin.gameNet });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
