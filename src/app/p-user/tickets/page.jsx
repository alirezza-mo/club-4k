import Layout from "@/components/layouts/UserPanelLayout";
import React from "react";
import { CiSearch } from "react-icons/ci";
import { TiTickOutline } from "react-icons/ti";
import { MdErrorOutline } from "react-icons/md";
import Tickets from "@/components/templates/p-user/tickets/Tickets";
import Link from "next/link";

function page() {
  return (
    <>
      <Layout>
        <div className="w-full mt-10">
          <div className="w-full flex sm:flex-row flex-col-reverse items-center justify-center gap-10">
            <div className="flex items-center justify-center gap-2 p-5 rounded-lg bg-white dark:bg-gray-800">
              <TiTickOutline className="text-green-600 text-6xl" />
              <div>
                <p className="text-sm text-gray-400"> تیکت های پاسخ داده شده  </p>
                <p className="text-lg font-bold dark:text-white"> 4 </p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 p-5 rounded-lg bg-white dark:bg-gray-800">
              <CiSearch className="text-yellow-400 text-6xl"/>
              <div>
                <p className="text-sm text-gray-400"> تیکت های در حال بررسی </p>
                <p className="text-lg font-bold dark:text-white"> 1 </p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 p-5 rounded-lg bg-white dark:bg-gray-800">
              <MdErrorOutline className="text-red-600 text-6xl" />
              <div>
                <p className="text-sm text-gray-400"> تیکت های بسته شده</p>
                <p className="text-lg font-bold dark:text-white"> 1 </p>
              </div>
            </div>
            <Link href={"/p-user/tickets/sendTicket"} className="py-2 px-5 rounded-lg text-blue-500 border border-blue-500 hover:bg-blue-600 hover:text-white active:bg-blue-600 active:text-white cursor-pointer">
              ارسال تیکت جدید 
            </Link>
          </div>
          <div>
            <Tickets/>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default page;
