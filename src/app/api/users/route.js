import User from "../../../../models/Users";
import { NextResponse } from "next/server";
import connectToDb from "../../../../configs/db";

export async function GET(req) {
  await connectToDb();
  const users = await User.find({}).select("_id userName gameNet");
  return NextResponse.json(users);
}
