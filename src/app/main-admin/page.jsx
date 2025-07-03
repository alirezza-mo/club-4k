import Layout from "@/components/layouts/MainAdminLayout";
import DataCart from "@/components/templates/p-mainAdmin/index/DataChart";
import GameNetRegistrationChart from "@/components/templates/p-mainAdmin/index/GameNetRegistrationChart";
import GameSessionsChart from "@/components/templates/p-mainAdmin/index/GameSessionsChart";
import LatestTickets from "@/components/templates/p-mainAdmin/index/TicketBox";
import UserRegistrationChart from "@/components/templates/p-mainAdmin/index/UserRegistrationChart";
import React from "react";

function page() {
  return (
    <Layout>
      <div className="w-full flex flex-col mt-20 p-5">
        <DataCart />
        <div className="p-5">
          <h2 className="text-2xl my-5 dark:text-gold text-orange-600 font-bold ">
            {" "}
            میانگین ساعات بازی گیم نت ها{" "}
          </h2>
          <GameSessionsChart />
        </div>
        <div className="p-5">
          <h2 className="text-2xl my-5 dark:text-gold text-orange-600 font-bold ">
            {" "}
            میانگین کاربران ثبت نام کرده در کل گیم نت ها{" "}
          </h2>
          <UserRegistrationChart />
        </div>
        <div className="p-5">
          <h2 className="text-2xl my-5 dark:text-gold text-orange-600 font-bold ">
            {" "}
            تعداد گیم نت های ملحق شده {" "}
          </h2>
          <GameNetRegistrationChart/>
        </div>
        <LatestTickets/>
      </div>
    </Layout>
  );
}

export default page;
