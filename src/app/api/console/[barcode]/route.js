import { NextResponse } from "next/server";
import connectToDb from "../../../../../configs/db";
import Console from "../../../../../models/Console";
import GameSession from "../../../../../models/GameSession";

export async function GET(req, { params }) {
  try {
    await connectToDb();
    let { barcode } = params;
    
    // Normalize barcode
    if (barcode) {
      barcode = barcode.trim();
      barcode = barcode.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
    }
    
    // Try exact match first
    let consoleDevice = await Console.findOne({ barcode }).lean();
    
    // If not found, try case-insensitive regex
    if (!consoleDevice) {
      const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const rx = new RegExp(`^${escapeRegex(barcode)}$`, "i");
      consoleDevice = await Console.findOne({ barcode: { $regex: rx } }).lean();
    }
    
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


