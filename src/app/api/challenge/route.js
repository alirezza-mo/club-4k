
import { cookies } from "next/headers";
import Challenge from "../../../../models/Challenge";
import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/utils/auth";
import UsersModel from "../../../../models/Users";
import connectToDb from "../../../../configs/db";
import AdminModel from "../../../../models/Admin";
import { checkAndExpireChallenges } from "@/utils/challengeExpiration";

export async function POST(req) {
  try {
		await connectToDb();
		const body = await req.json();
		const { invited, location, fightTime, game, message } = body
		

		if (!invited || !location || !fightTime || !game) {
			return NextResponse.json({ error: "اطلاعات ناقص" }, { status: 400 });
		}

		const token = await cookies().get("accessToken")?.value;
		if (!token) {
			return NextResponse.json({ error: "توکن ارسال نشده" }, { status: 401 });
		}
		let payload;
		try {
			payload =await verifyAccessToken(token);
		} catch {
			return NextResponse.json({ error: "توکن نامعتبر" }, { status: 401 });
		}
		const inviter = await UsersModel.findById(payload.id);
		if (!inviter) {
			return NextResponse.json({ error: "کاربر دعوت‌کننده یافت نشد" }, { status: 404 });
		}
console.log(inviter);

		const invitedUser = await UsersModel.findOne({ userName : invited });
		if (!invitedUser) {
			return NextResponse.json({ error: "کاربر دعوت‌شده یافت نشد" }, { status: 404 });
		}
		const gameNetLocation = await AdminModel.findOne({ gameNet: location });
		if (!gameNetLocation) {
			return NextResponse.json({ error: "محل برگزاری معتبر نیست" }, { status: 404 });
		}

		const fightDate = new Date(fightTime);
		if (isNaN(fightDate.getTime()) || fightDate < new Date()) {
			return NextResponse.json({ error: "تاریخ رقابت معتبر نیست" }, { status: 400 });
		}

		const exists = await Challenge.findOne({
			inviter: inviter._id,
			invited: invitedUser._id,
			location: gameNetLocation._id,
			fightTime: fightDate,
		});
		if (exists) {
			return NextResponse.json({ error: "چالش تکراری" }, { status: 409 });
		}

		const challenge = await Challenge.create({
			inviter: inviter._id,
			invited: invitedUser._id,
			location: gameNetLocation._id,
			game,
			message,
			fightTime: fightDate,
		});
		
		return NextResponse.json(challenge, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req) {
	try {
		await connectToDb();
		
		await checkAndExpireChallenges();
		
		const token = await cookies().get("accessToken")?.value;
		const payload = await verifyAccessToken(token);
		const user = await UsersModel.findById(payload.id);
		if (!user) {
			return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
		}
		const challengeInviter = await Challenge.find({ inviter: user._id }).populate("inviter invited location")
		const challengeInvited = await Challenge.find({ invited: user._id }).populate("invited inviter location")
		const challenges = [...challengeInviter, ...challengeInvited].sort((a, b) => new Date(b.fightTime) - new Date(a.fightTime));

		return NextResponse.json(challenges)
		
		
	} catch (err) {
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}

export async function PATCH(req) {
	try {
		const body = await req.json();
		if (!body.id || !body.status) {
			return NextResponse.json({ error: "اطلاعات ناقص" }, { status: 400 });
		}
		// فقط کاربر دعوت‌شده مجاز است
		const challenge = await Challenge.findById(body.id);
		if (!challenge) {
			return NextResponse.json({ error: "چالش یافت نشد" }, { status: 404 });
		}
		// اینجا باید احراز هویت و مجوز را بررسی کنید
		challenge.status = body.status;
		await challenge.save();
		return NextResponse.json(challenge);
	} catch (err) {
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}

export async function PUT(req) {
	try {
		const body = await req.json();
		if (!body.id || !body.result) {
			return NextResponse.json({ error: "اطلاعات ناقص" }, { status: 400 });
		}
		const challenge = await Challenge.findById(body.id);
		if (!challenge) {
			return NextResponse.json({ error: "چالش یافت نشد" }, { status: 404 });
		}
		challenge.result = body.result;
		if (body.session) challenge.session = body.session;
		await challenge.save();
		return NextResponse.json(challenge);
	} catch (err) {
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}
