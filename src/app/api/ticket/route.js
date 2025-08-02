import { cookies } from "next/headers";
import connectToDb from "../../../../configs/db";
import { verifyAccessToken } from "@/utils/auth";
import UserModel from "../../../../models/Users"
import TicketModel from "../../../../models/Ticket"




export async function POST(req) {
  try {
    connectToDb();
    const token = cookies().get("token")?.value;
    let user = null;
  
    if (token) {
      const tokenPayload = verifyAccessToken(token);
      if (tokenPayload) {
        const idToken = tokenPayload._id
        user = await UserModel.findOne({ idToken });
      }
    }
  
    const reqBody = await req.json();
    const { title, body, department, priority } = reqBody;

    // Validation (You)

    await TicketModel.create({
      title,
      body,
      department,
      priority,
      user: user._id,
    });

    return Response.json(
      { message: "Ticket saved successfully :))" },
      { status: 201 }
    );
  } catch (err) {
    return Response.json({ message: err }, { status: 500 });
  }
}
