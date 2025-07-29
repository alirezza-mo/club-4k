import { NextResponse } from "next/server";
import UserModel from "../../../../../models/Users";
import { v4 as uuidv4 } from "uuid";
import { extname } from "path";
import { cookies } from "next/headers";
import connectToDb from "../../../../../configs/db";
import { deleteFromS3, uploadToS3 } from "@/utils/s3";
import { verifyAccessToken } from "@/utils/auth";

export async function POST(req) {
  try {
    await connectToDb();
    const token = cookies().get("accessToken")?.value;

    if (!token)
      return NextResponse.json({ message: "توکن ارسال نشده" }, { status: 401 });

    const payload = await verifyAccessToken(token);
    if (!payload)
      return NextResponse.json(
        { message: "توکن نامعتبر است" },
        { status: 403 }
      );

    const user = await UserModel.findById(payload.id);
    if (!user)
      return NextResponse.json({ message: "کاربر یافت نشد" }, { status: 404 });

    const formData = await req.formData();

    const firstName = formData.get("firstName");
    const avatarFile = formData.get("avatar");
    const lastName = formData.get("lastName");
    const coverFile = formData.get("cover");
    const bio = formData.get("bio");
    const age = formData.get("age");
    
    if (avatarFile) {
      const buffer = Buffer.from(await avatarFile.arrayBuffer());
      const fileName = `users/${user._id}/avatar-${uuidv4()}${extname(
        avatarFile.name
      )}`;

      if (user.avatar) {
        await deleteFromS3(user.avatar);
      }

      const uploadedKey = await uploadToS3(buffer, fileName, avatarFile.type);
      user.avatar = uploadedKey;
    }

    if (coverFile) {
      const buffer = Buffer.from(await coverFile.arrayBuffer());
      const fileName = `users/${user._id}/cover-${uuidv4()}${extname(
        coverFile.name
      )}`;

      if (user.profile) {
        await deleteFromS3(user.profile);
      }

      const uploadedKey = await uploadToS3(buffer, fileName, coverFile.type);
      user.profile = uploadedKey;
    }
    console.log(bio , firstName , lastName , age);
    
    if (bio) user.bio = bio;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (age) user.age = parseInt(age);

    const savedUser = await user.save();

    return NextResponse.json({ message: "پروفایل با موفقیت بروزرسانی شد" , savedUser } , {status : 200 });
  } catch (error) {
    console.error("خطا در API پروفایل:", error);
    return NextResponse.json(
      { message: "خطای سرور", error: error.message },
      { status: 500 }
    );
  }
}
