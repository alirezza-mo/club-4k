import ChallengeBox from "@/components/modules/ChallengeBox/ChallengeBox";
import Link from "next/link";
import React from "react";
import { GiBattleGear } from "react-icons/gi";

function Challenge() {
  return (
    <>
      <section className="mt-20 w-full flex flex-col items-center gap-10">
        <div className="w-full flex justify-center items-center text-xl sm:text-3xl">
          <h3 className="dark:text-white font-bold flex items-center gap-2 border-b-4 dark:border-gold border-orange-600 pb-2 dark:hover:border-none hover:border-none ">
            {" "}
            چلنج های آینده
            <GiBattleGear />
          </h3>
        </div>
        <div className="mt-10 w-full flex items-center justify-center gap-6 flex-wrap">
          <ChallengeBox/>
          <ChallengeBox/>
          <ChallengeBox/>
          <ChallengeBox/>
        </div>
        <Link href={"/challenge"} className="p-2 rounded-lg bg-red-600 text-white font-bold text-2xl">
          به چالش کشیدن 
        </Link>
      </section>
    </>
  );
}

export default Challenge;
