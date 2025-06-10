import React from "react";
import SideBar from "@/components/modules/p-user/SideBar";
import TopBar from "@/components/modules/p-user/TopBar";

function Layout({ children }) {
  return (
    <>
      <main className="w-full min-h-screen bg-amber-50 dark:bg-black/90">
        <section className="flex md:flex-row flex-col w-full justify-between">
          <div className="md:w-[20%]">
            <SideBar />
          </div>
          <div className="sm:mt-0 mt-20 flex flex-col md:w-[80%] ">
            <TopBar />
            {children}
          </div>
        </section>
      </main>
    </>
  );
}

export default Layout;
