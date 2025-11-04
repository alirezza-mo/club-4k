import React from "react";
import Layout from "@/components/layouts/UserPanelLayout";
import { CiSearch } from "react-icons/ci";
import { TiTickOutline } from "react-icons/ti";
import { MdErrorOutline } from "react-icons/md";
import Tickets from "@/components/templates/p-user/tickets/Tickets";
import Link from "next/link";
import Ticket from "../../../../models/Ticket";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/utils/auth";
import Users from "../../../../models/Users";
import connectToDb from "../../../../configs/db";

export default async function Page() {
  await connectToDb();

  const token = cookies().get("accessToken")?.value;
  const payload = token ? verifyAccessToken(token) : null;
  if (!payload) return <div>Unauthorized</div>;
  const user = await Users.findById(payload.id).select("-password").lean();

  const tickets = await Ticket.find({ user: user._id }).sort({ createdAt: -1 }).lean();
  const resolvedCount = tickets.filter((t) => t.isAnswer).length;
  const inProgressCount = tickets.filter((t) => !t.isAnswer && !t.hasAnswer).length;
  const closedCount = tickets.filter((t) => t.hasAnswer && t.isAnswer).length;

  return (
    <>
      <Layout>
        <div className="w-full mt-10">
          <div className="w-full flex sm:flex-row flex-col-reverse items-center justify-center gap-10">
            <div className="flex items-center justify-center gap-2 p-5 rounded-lg bg-white dark:bg-gray-800">
              <TiTickOutline className="text-green-600 text-6xl" />
              <div>
                <p className="text-sm text-gray-400"> تیکت های پاسخ داده شده </p>
                <p className="text-lg font-bold dark:text-white"> {resolvedCount} </p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 p-5 rounded-lg bg-white dark:bg-gray-800">
              <CiSearch className="text-yellow-400 text-6xl" />
              <div>
                <p className="text-sm text-gray-400"> تیکت های در حال بررسی </p>
                <p className="text-lg font-bold dark:text-white"> {inProgressCount} </p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 p-5 rounded-lg bg-white dark:bg-gray-800">
              <MdErrorOutline className="text-red-600 text-6xl" />
              <div>
                <p className="text-sm text-gray-400"> تیکت های بسته شده</p>
                <p className="text-lg font-bold dark:text-white"> {closedCount} </p>
              </div>
            </div>
            <Link
              href={"/p-user/tickets/sendTicket"}
              className="py-2 px-5 rounded-lg text-blue-500 border border-blue-500 hover:bg-blue-600 hover:text-white active:bg-blue-600 active:text-white cursor-pointer"
            >
              ارسال تیکت جدید
            </Link>
          </div>
          <div>
            <Tickets tickets={tickets} />
          </div>
        </div>
      </Layout>
    </>
  );
}
