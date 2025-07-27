
import Users from "../../../../../../models/Users"
import { hashedPass, validatePassword, validatePhone } from "@/utils/auth";
import connectToDb from "../../../../../../configs/db";

export async function POST(req) {
  await connectToDb();
  const { phone, password } = await req.json();
  try {

    const isValidPhone = await validatePhone(phone);
    const isValidPassword = await validatePassword(password);

    if (!isValidPassword) {
      return Response.json({ msg: "رمز عبور صحیح نیست" }, { status: 401 });
    }
    if (!isValidPhone) {
      return Response.json({ msg: "شماره همراه صحیح نیست" }, { status: 402 });
    }

    const hashedPassword = await hashedPass(password);
    const user = await Users.findOneAndUpdate(
      { phone },
      { password: hashedPassword }
    );
    if (!user) {
      return Response.json({ message: "کاربری پیدا نشد." }, { status: 405 });
    }

    return Response.json(
      { message: "رمز جدید با موفقیت ثبت شد." },
      { status: 200 }
    );
  } catch (err) {
    console.error("ارسال ناموفق:", err?.response?.data || err.message);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "خطا در ارسال ",
        error: err.message,
      }),
      { status: 500 }
    );
  }
}
