import { cookies } from "next/headers";
import connectToDb from "../../../../../configs/db";
import { verifyAccessToken } from "@/utils/auth";
import TicketModel from "../../../../../models/Ticket";
import UserModel from "../../../../../models/Users";

export async function POST(req) {
  try {
    connectToDb();
    const reqBody = await req.json();
    const { title, body, department, priority, ticketID } =
      reqBody;
    const token = await cookies ().get("token")?.value;
    let user = null;

    if (token) {
      const tokenPayload = verifyAccessToken(token);
      if (tokenPayload) {
        const idToken = tokenPayload._id
        user = await UserModel.findOne( {idToken} );
      }
    }

    await TicketModel.findByIdAndUpdate(
      { _id: ticketID },
      {
        $set: {
          hasAnswer: true,
        },
      }
    );

    await TicketModel.create({
      title,
      body,
      department,
      priority,
      user: user._id,
      hasAnswer: false,
      isAnswer: true,
      mainTicket: ticketID,
    });

    return Response.json(
      { message: "Answer saved successfully :))" },
      { status: 201 }
    );
  } catch (err) {
    return Response.json({ message: err }, { status: 500 });
  }
}
