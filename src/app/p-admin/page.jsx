import Layout from "@/components/layouts/AdminPanelLayout";
import DataCart from "@/components/templates/p-admin/index/DataCart";
import React from "react";
import Notifications from "@/components/templates/p-admin/index/Notifications";
import Tickets from "@/components/templates/p-admin/index/Tickets";
import Chart from "@/components/templates/p-admin/index/Chart";
import UserGrowthChart from "@/components/templates/p-admin/index/Chart";
import ChallengePieChart from "@/components/templates/p-admin/index/ChallengeChart";
import GameSessionPolarChart from "@/components/templates/p-admin/index/GameCoursesChart";
// server-side DB fetch removed: DataCart fetches its own data

async function page() {
  return (
    <>
      <Layout>
        <div className="w-full flex flex-col mt-20 p-5">
          <h1 className="text-2xl font-bold text-orange-600 dark:text-gold mb-6 ">
            داشبورد ادمین
          </h1>
          <DataCart />
          <UserGrowthChart />
          <Tickets />
          <GameSessionPolarChart
            dataPerDay={{
              یکشنبه: 10,
              دوشنبه: 5,
              سه‌شنبه: 8,
              چهارشنبه: 3,
              پنجشنبه: 7,
              جمعه: 12,
              شنبه: 4,
            }}
          />
          <Notifications />
          {/* <ChallengePieChart total={30} success={20} failed={5} /> */}
        </div>
      </Layout>
    </>
  );

}

export default page;

