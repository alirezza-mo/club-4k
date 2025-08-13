import { NextResponse } from "next/server";
import connectToDb from "../../../../../configs/db";
import UserModel from "../../../../../models/Users";

export async function GET (req, { params }) {
  const { userId } = params;
  try {
    await connectToDb();
    const user = await UserModel.findById(userId)
    if (!user) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }
    
    return NextResponse.json(user);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}