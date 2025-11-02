import ChallengeBox from "@/components/modules/ChallengeBox/ChallengeBox";
import Link from "next/link";
import React from "react";
import { GiBattleGear } from "react-icons/gi";
import connectToDb from "../../../../../configs/db";
import ChallengeModel from "../../../../../models/Challenge";
import { checkAndExpireChallenges } from "@/utils/challengeExpiration";

async function Challenge() {
  await connectToDb();

  await checkAndExpireChallenges();

  const challengeRes = await ChallengeModel.find({ status: "accepted" })
    .populate("inviter invited location")
    .sort({ fightTime: -1 })
    .limit(6)
    .lean();

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
          {Array.isArray(challengeRes) && challengeRes.length > 0 ? (
            challengeRes.map((challenge, index) => (
              <ChallengeBox
                key={challenge._id || index}
                challenge={challenge}
                className="w-full sm:w-[300px] md:w-[350px] lg:w-[400px]"
              />
            ))
          ) : (
            <div className="bg-white dark:bg-black p-2 rounded-lg font-bold text-gray-800 dark:text-gray-400 text-center text-2xl">
              چالشی برای نمایش وجود ندارد.
            </div>
          )}
        </div>
        <Link
          href={"/challenge"}
          className="p-2 rounded-lg bg-red-600 text-white font-bold text-2xl"
        >
          به چالش کشیدن
        </Link>
      </section>
    </>
  );
}

export default Challenge;
