import MotivationBox from "@/components/modules/MotivationBox/MotivationBox";
import Link from "next/link";
import React from "react";
import { TbArrowsRandom } from "react-icons/tb";

function Motivational() {
  return (
    <>
      <section id="ranking" className="mt-20 w-full ">
        <div className="w-full flex justify-between items-center text-xl sm:text-2xl">
          <h3 className="font-bold flex items-center gap-2 border-b-4 border-orange-600 pb-2 hover:border-none dark:border-gold dark:text-white ">
            {" "}
            یک جمله رندوم
            <TbArrowsRandom />
          </h3>
          <Link
            href={"/randomsentence"}
            className=" text-lg p-2 rounded-lg dark:bg-gold  bg-orange-600 dark:text-white text-white transition-all dark:hover:bg-transparent hover:bg-transparent dark:active:bg-transparent active:bg-transparent dark:hover:text-gold hover:text-orange-600 dark:active:text-gold active:text-orange-600 "
          >
            {" "}
            مشاهده همه ...{" "}
          </Link>
        </div>
        <div className="mt-14 w-full rounded-lg flex items-center justify-center lg:justify-between gap-5 flex-wrap">
          <MotivationBox/>
          <MotivationBox/>
          <MotivationBox/>
        </div>
      </section>
    </>
  );
}

export default Motivational;
