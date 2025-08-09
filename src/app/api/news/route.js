import connectToDb from "../../../../configs/db";
import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/utils/auth";
import { cookies } from "next/headers";
import AdminModel from "../../../../models/Admin";
import NewsModel from "../../../../models/News";
import { uploadToS3 } from "@/utils/s3";
import { v4 as uuidv4 } from "uuid";
import { extname } from "path";


export async function POST(req) {
  const formData = await req.formData();
  const content = formData.get("content")?.toString() || "";
  const image = formData.get("image") ;

  try {
    await connectToDb();
    const token = await cookies().get("accessToken")?.value;
    if (!token) {
      return NextResponse.json({ message: "عدم وجود توکن" }, { status: 400 });
    }
    const payload = await verifyAccessToken(token);
    if (!payload) {
      return NextResponse.json(
        { message: " توکن اشتباه است . " },
        { status: 401 }
      );
    }
    const admin = await AdminModel.findById(payload.id);
    if (!admin) {
      return NextResponse.json(
        { message: " ادمین وجود ندارد. " },
        { status: 402 }
      );
    }
    let imageUrl = null;
    if (image) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const fileName = `news/${admin._id}/news-${uuidv4()}${extname(
        image.name
      )}`;

      const uploadedKey = await uploadToS3(buffer, fileName, image.type);
      imageUrl = uploadedKey;
    }
    if(!content) {
      NextResponse.json(
        { message: " محتوای خبر را خالی نگذارید. " },
        { status: 403 }
      );
    }
    const news = await NewsModel.create({
      admin,
      content,
      image: imageUrl,
    });
    console.log(news);
    
    return NextResponse.json({ message: "خبر با موفقیت ایجاد شد", news }, { status: 201 });
  } catch (err) {
    console.log(err);
  }
}
