import NewsBox from "@/components/modules/NewsBox/NewsBox";
import Link from "next/link";
import React from "react";
import { GiNewspaper } from "react-icons/gi";

function News() {
  return (
    <>
      <section className="mt-20 w-full ">
        <div className="w-full flex justify-between items-center text-xl sm:text-2xl">
          <h3 className="dark:text-white font-bold flex items-center gap-2 border-b-4 dark:border-gold border-orange-600 pb-2 hover:border-none ">
            {" "}
            اخبار
            <GiNewspaper />
          </h3>
          <Link
            href={"#"}
            className=" text-lg p-2 rounded-lg dark:bg-gold dark:text-white bg-orange-600 text-white transition-all hover:bg-transparent active:bg-transparent hover:text-orange-600 active:text-orange-600 dark:hover:bg-transparent dark:active:bg-transparent dark:hover:text-gold dark:active:text-gold"
          >
            {" "}
            مشاهده همه ...{" "}
          </Link>
        </div>
        <div className="mt-14 w-full rounded-lg flex justify-center gap-5 sm:gap-30 items-center">
          <div className="flex flex-col items-center gap-10">
            <h3 className="text-xl text-gray-600 dark:text-gray-400"> اخبار 4K </h3>
            <div className="flex flex-col justify-center items-center gap-2">
              <NewsBox />
              <NewsBox />
              <NewsBox />
            </div>
          </div>
          {/* <span className="h-full w-1 bg-orange-700"></span> */}
          <div className="flex flex-col items-center gap-10">
            <h3 className="text-xl text-gray-600 dark:text-gray-400 "> سایر اخبار </h3>
            <div className="flex flex-col justify-center items-center gap-2">
              <NewsBox />
              <NewsBox />
              <NewsBox />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default News;
