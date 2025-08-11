  import React from "react";
  import SideBar from "@/components/modules/p-user/SideBar";
  import TopBar from "@/components/modules/p-user/TopBar";
  import connectToDb from "../../../configs/db";
  import { cookies } from "next/headers";
  import { verifyAccessToken } from "@/utils/auth";
  import Users from "../../../models/Users";
  import { redirect } from "next/navigation";

  async function Layout({ children }) {

    await connectToDb();

    const token = await cookies().get("accessToken")?.value;

    if (!token) {
      redirect("/");
    }

    let user = null;
    if (token) {
      const payload = verifyAccessToken(token);
      if (payload) {
        const rawUser = await Users.findById(payload.id)
          .select("-password")
          .lean();
        user = JSON.parse(JSON.stringify(rawUser));
      }
    }
    if (!user) {
      redirect("/login");
    }

    return (
      <>
        <main className="w-full min-h-screen bg-amber-50 dark:bg-black/90">
          <section className="flex md:flex-row flex-col w-full justify-between">
            <div className="md:w-[20%]">
              <SideBar userName = {user.userName} gameNet = {user.gameNet} />
            </div>
            <div className="sm:mt-0 mt-20 flex flex-col md:w-[80%] ">
              <TopBar userName = {user.userName} gameNet = {user.gameNet} />
              {children}
            </div>
          </section>
        </main>
      </>
    );
  }

  export default Layout;
