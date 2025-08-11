import Challenge from "../../../../models/Challenge";
import { NextResponse } from "next/server";

// ایجاد چالش جدید
export async function POST(req) {
	try {
		const body = await req.json();
		// اعتبارسنجی ورودی
		if (!body.inviter || !body.invited || !body.location || !body.fightTime) {
			return NextResponse.json({ error: "اطلاعات ناقص" }, { status: 400 });
		}
		// جلوگیری از چالش تکراری
		const exists = await Challenge.findOne({
			inviter: body.inviter,
			invited: body.invited,
			fightTime: body.fightTime,
		});
		if (exists) {
			return NextResponse.json({ error: "چالش تکراری" }, { status: 409 });
		}
		const challenge = await Challenge.create(body);
		return NextResponse.json(challenge, { status: 201 });
	} catch (err) {
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}

// دریافت لیست چالش‌ها
export async function GET(req) {
	try {
		const { searchParams } = new URL(req.url);
		const filter = {};
		if (searchParams.get("inviter")) filter.inviter = searchParams.get("inviter");
		if (searchParams.get("invited")) filter.invited = searchParams.get("invited");
		if (searchParams.get("status")) filter.status = searchParams.get("status");
		const challenges = await Challenge.find(filter).populate("inviter invited location session");
		return NextResponse.json(challenges);
	} catch (err) {
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}

// پذیرش یا رد چالش
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

// ثبت نتیجه و جزئیات بازی
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
