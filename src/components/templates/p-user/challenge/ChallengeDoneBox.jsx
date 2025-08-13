import React from "react";

function ChallengeDoneBox({challenge}) {
  return (
    <article className=" border-2 border-orange-600 dark:border-gold bg-white dark:bg-gray-800 rounded-lg p-10 mb-4 flex flex-col gap-4 transition-all hover:scale-105">
      <div className=" rounded-lg " />
      <div className="flex justify-between items-center">
        <p className="font-bold text-lg text-gray-700 dark:text-gray-200">
           {challenge?.inviter.userName} ⬅️ {challenge?.invited.userName}
        </p>
        <p className="font-vazir text-sm text-gray-500 dark:text-gray-400"></p>
      </div>
      <p className="font-vazir text-gray-700 dark:text-gray-200">
        <span className="font-bold">بازی:</span> {challenge?.game}
      </p>
      <p className="font-vazir text-gray-700 dark:text-gray-200">
        <span className="font-bold">محل انجام بازی</span> {challenge?.location.gameNet}
      </p>
      <p className="font-vazir text-gray-700 dark:text-gray-200">
        <span className="font-bold">وضعیت:</span>{" "}
        <span className={"text-green-500"}>
          {challenge?.status === "accepted" ? "پذیرفته شده" : "رد شده"}
        </span>
      </p>
      <p className="font-vazir text-lg text-gray-700 dark:text-gray-200">
          {}
      </p>
    </article>
  );
}

export default ChallengeDoneBox
