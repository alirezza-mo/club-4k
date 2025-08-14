import { NextResponse } from "next/server";
import connectToDb from "../../../../../configs/db";
import Console from "../../../../../models/Console";
import GameSession from "../../../../../models/GameSession";

export async function GET(req, { params }) {
  try {
    await connectToDb();
    const { barcode } = params;
    const consoleDevice = await Console.findOne({ barcode }).lean();
    if (!consoleDevice) {
      return NextResponse.json(
        { message: "کنسول یافت نشد" },
        { status: 404 }
      );
    }
    let session = null;
    if (consoleDevice.currentSession) {
      session = await GameSession.findById(consoleDevice.currentSession)
        .populate("player1", "userName phone")
        .populate("player2", "userName phone")
        .lean();
    }
    return NextResponse.json({ console: consoleDevice, session });
  } catch (err) {
    return NextResponse.json(
      { message: "خطای داخلی سرور", error: err.message },
      { status: 500 }
    );
  }
}


