import { NextResponse } from "next/server";
import Comment from "../../../../../../models/Comment";
import connectToDb from "../../../../../../configs/db";

export async function GET(req, { params }) {
  try {
    await connectToDb();
    const { userId } = params;

    const sort = req.nextUrl.searchParams.get("sort") || "newest";
    const sortOption = sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

    // Use .lean() to get plain JS objects, then sanitize ObjectId and Date fields
    const comments = await Comment.find({ user: userId })
      .sort(sortOption)
      .populate("user", "userName")
      .lean();

    const sanitizedComments = (comments || []).map((c) => ({
      // keep other plain fields as-is
      ...c,
      _id: c._id ? String(c._id) : c._id,
      user: c.user
        ? {
            _id: c.user._id ? String(c.user._id) : c.user._id,
            userName: c.user.userName,
          }
        : null,
      createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : c.createdAt,
      updatedAt: c.updatedAt ? new Date(c.updatedAt).toISOString() : c.updatedAt,
    }));

    return NextResponse.json({ comments: sanitizedComments });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
