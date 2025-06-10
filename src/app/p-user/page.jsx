import Layout from "@/components/layouts/UserPanelLayout";
import React from "react";
import Challenges from "@/components/templates/p-user/index/Challenges";
import Comments from "@/components/templates/p-user/index/Comments";
import Tickets from "@/components/templates/p-user/index/Tickets";

function page() {
  return (
    <>
      <Layout>
        <div className="w-full mt-5  ">
          <div className=" border-b-2 border-dashed dark:border-gold border-orange-600 w-full flex items-center justify-between p-1 sm:p-5 dark:text-gray-400 text-gray-800 text-xs sm:text-lg sm:font-bold ">
            <div>
              <p> تعداد تیکت ها : 5 </p>
            </div>
            <div>
              {" "}
              <p> تعداد چلنج ها : 4 </p>{" "}
            </div>
            <div>
              {" "}
              <p> تعداد کامنت ها : 20 </p>{" "}
            </div>
            <div>
              {" "}
              <p className="text-blue-500"> XP : 360 </p>{" "}
            </div>
          </div>
          <div className="mt-10 ">
            <Tickets/>
          </div>
          <div className="mt-10">
            <Challenges/>
          </div>
          <div className="mt-10">
            <Comments/> 
          </div>
        </div>
      </Layout>
    </>
  );
}

export default page;
