import React from "react";
import SideBar from "../modules/MainAdmin/SideBar";
import Topbar from "../modules/MainAdmin/TopBar";
import RefreshAccessToken from "@/components/Auth/RefreshAccessToken";
function Layout({ children }) {
  return (
    <>
      <main className="w-full min-h-screen bg-amber-50 dark:bg-black/90">
        <RefreshAccessToken />
          <section className="flex md:flex-row flex-col w-full justify-between">
            <div className="md:w-[20%]">
              <SideBar />
            </div>
            <div className="sm:mt-0 mt-20 flex flex-col  items-center md:w-[80%] ">
              <Topbar />
              {children}
            </div>
          </section>
      </main>
    </>
  );
}

export default Layout;
