import React from "react";
import { FaClock } from "react-icons/fa";
import { getExpirationInfo } from "@/utils/challengeExpiration";

function Challenge({ challenge }) {
  const expirationInfo = getExpirationInfo(challenge);
  
  return (
    <article className=" border-2 border-orange-600 dark:border-gold bg-white dark:bg-black/90 rounded-lg p-10 mb-4 flex flex-col gap-4 transition-all hover:scale-105 relative">
      {expirationInfo && (
        <div className='absolute top-4 right-4 flex items-center gap-1 text-xs bg-orange-100 dark:bg-orange-900 px-2 py-1 rounded'>
          <FaClock className='text-orange-600 dark:text-gold' />
          {expirationInfo.expired ? (
            <span className='text-red-600 dark:text-red-400 font-bold'>منقضی شده</span>
          ) : (
            <span className='text-orange-600 dark:text-gold'>
              {expirationInfo.hours > 0 ? `${expirationInfo.hours}` : ''}
              {expirationInfo.minutes}
            </span>
          )}
        </div>
      )}
      
      <div className=" rounded-lg " />
      <div className="flex justify-between items-center">
        <p className="font-bold text-lg text-gray-700 dark:text-gray-200">
          {challenge?.inviter.userName} {challenge?.invited.userName}{" "}
          <span className="text-orange-600 dark:text-gold"> VS </span>
        </p>
        <p className="font-vazir text-sm text-gray-500 dark:text-gray-400"></p>
      </div>
      <p className="font-vazir text-gray-700 dark:text-gray-200">
        <span className="font-bold text-orange-600 dark:text-gold">بازی</span>{" "}
        {challenge?.game}
      </p>
      <p className="font-vazir text-gray-700 dark:text-gray-200">
        <span className="font-bold text-orange-600 dark:text-gold">زمان</span>{" "}
        {new Date(challenge?.fightTime).toLocaleString("fa-IR")}
      </p>
      <p className="font-vazir text-gray-700 dark:text-gray-200">
        <span className="font-bold text-orange-600 dark:text-gold">لوکیشن</span>{" "}
        {challenge?.location?.gameNet}
      </p>
      <p className="font-vazir text-gray-700 dark:text-gray-200">
        <span className="font-bold text-orange-600 dark:text-gold">وضعیت</span>{" "}
        <span className={
          challenge?.status === "accepted" ? "text-green-500" :
          challenge?.status === "rejected" ? "text-red-500" :
          "text-yellow-500"
        }>
          {challenge?.status === "accepted" ? "پذیرفته شده" : 
           challenge?.status === "rejected" ? "رد شده" : 
           "در انتظار"}
        </span>
      </p>
      
      {expirationInfo && expirationInfo.expired && (
        <div className='text-xs text-red-600 dark:text-red-400 font-bold bg-red-100 dark:bg-red-900/50 px-3 py-2 rounded border border-red-300 dark:border-red-700'>
          ⚠️ این چالش منقضی شده و به زودی رد خواهد شد
        </div>
      )}
    </article>
  );
}

export default Challenge;
