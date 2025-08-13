"use client"
import React, { useState } from "react";
import ChallengeDoneBox from "./ChallengeDoneBox";

function ChallengesDone({challengesDone}) {
  const [displayedCount, setDisplayedCount] = useState(10);

  const handleLoadMore = () => {
    setDisplayedCount(prev => prev + 5);
  };

  const displayedChallenges = Array.isArray(challengesDone) 
    ? challengesDone.slice(0, displayedCount) 
    : [];

  const hasMoreChallenges = Array.isArray(challengesDone) && challengesDone.length > displayedCount;

  return (
    <>
      <div className="w-full">
        <div className="flex justify-between items-center p-3 w-full border-r-8 border-orange-600 dark:border-gold">
          <h3 className="text-lg dark:text-white "> رقابت های انجام شده</h3>
          
        </div>
        <div className="flex flex-wrap items-center justify-center gap-1">
          {displayedChallenges.length > 0 ? (
            displayedChallenges.map((challenge, index) => (  
              <ChallengeDoneBox
              
                key={challenge._id || index}
                challenge={challenge}
                className="w-full sm:w-[300px] md:w-[350px] lg:w-[400px]"
              />
            ))
          ) : (
            <div className="bg-white dark:bg-black p-2 rounded-lg font-bold text
              gray-800 dark:text-gray-400 text-center text-2xl">
                رقابتی برای نمایش وجود ندارد.
            </div>
          )}
        </div>
        {hasMoreChallenges && (
          <button
            onClick={handleLoadMore}
            className="block w-36 self-center text-center justify-self-center my-2 text-base p-1 rounded-lg dark:bg-gold dark:text-white bg-orange-600 text-white transition-all hover:bg-transparent active:bg-transparent hover:text-orange-600 active:text-orange-600 dark:hover:bg-transparent dark:active:bg-transparent dark:hover:text-gold dark:active:text-gold"
          >
            {" "}
            ادامه{" "}
          </button>
        )}
      </div>
    </>
  );
}

export default ChallengesDone;
