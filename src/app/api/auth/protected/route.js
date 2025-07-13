import { verifyAccessToken } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function GET(req) {
  const cookie = req.headers.get("cookie") || "";
  const accessToken = cookie
    .split("; ")
    .find((c) => c.startsWith("accessToken="))
    ?.split("=")[1];

  if (!accessToken) {
    return NextResponse.json({ error: "No access token" }, { status: 401 });
  }

  try {
    const payload = verifyAccessToken(accessToken);

    return NextResponse.json({
      message: "Protected data",
      userId: (payload).userId,
    });
  } catch {
    return NextResponse.json({ error: "Invalid or expired access token" }, { status: 401 });
  }
}
