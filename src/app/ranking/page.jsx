import Footer from "@/components/modules/Footer/Footer";
import Navbar from "@/components/modules/Navbar/Navbar";
import LeaderboardCard from "@/components/templates/ranking/RankBox";
import RankFilterSelect from "@/components/templates/ranking/RankFilter";
import SelectDropdown from "@/components/templates/ranking/SelectDropDown";
import userModel from "../../../models/Users";
import React from "react";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/utils/auth";
import ClientLeaderboard from "../../components/templates/ranking/ClientLeaderboard";

async function page() {
  const users = await userModel.find();

  const token = await cookies().get("accessToken")?.value;

  let user = null;
  if (token) {
    const payload = verifyAccessToken(token);
    if (payload) {
      const rawUser = await userModel
        .findById(payload.id)
        .select("-password")
        .lean();
      user = JSON.parse(JSON.stringify(rawUser));
    }
  }

  return (
    <>
      <main className="relative bg-lime-200 dark:bg-black/95 ">
        <Navbar />
        <Navbar />
        <ClientLeaderboard initialUsers={JSON.parse(JSON.stringify(users))} />
        <Footer />
        <Footer />
      </main>
    </>
  );
}

export default page;
