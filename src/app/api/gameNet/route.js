import Admin from "../../../../models/Admin";
import { NextResponse } from "next/server";
import connectToDb from "../../../../configs/db";

export async function GET(req) {
  await connectToDb();
  const Admins = await Admin.find({}).select("_id gameNet");
  return NextResponse.json(Admins);
}
