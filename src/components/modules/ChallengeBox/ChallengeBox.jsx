import React from 'react'
import { GiCrossedSwords } from "react-icons/gi";
import { FaClock } from "react-icons/fa";
import { getExpirationInfo } from "@/utils/challengeExpiration";

function ChallengeBox({challenge}) {
  console.log(challenge);
  
  const expirationInfo = getExpirationInfo(challenge);
  
  return (
    <>
      <div className='p-3 sm:p-6 rounded-lg dark:bg-gold dark:text-black bg-orange-600 text-white flex flex-col items-center justify-center gap-5 relative'>
          {expirationInfo && (
            <div className='absolute top-2 right-2 flex items-center gap-1 text-xs'>
              <FaClock className='text-yellow-300' />
              {expirationInfo.expired ? (
                <span className='text-red-300 font-bold'>منقضی شده</span>
              ) : (
                <span className='text-yellow-300'>
                  {expirationInfo.hours > 0 ? `${expirationInfo.hours}` : ''}
                  {expirationInfo.minutes}
                </span>
              )}
            </div>
          )}
          
          <div className='flex items-center justify-center gap-2 sm:gap-5 w-full font-bold'>
            <h4 className='text-xl sm:text-2xl'> { challenge.inviter.userName }  </h4>
                <GiCrossedSwords className='text-3xl sm:text-6xl p-2 rounded-full dark:bg-black dark:text-yellow-600 bg-white text-orange-800'/>
            <h4 className='text-xl sm:text-2xl'> { challenge.invited.userName }  </h4>
          </div>
          <div className='text-xs text-gray-300'>
            {` ${new Date(challenge.fightTime).toLocaleDateString("fa-IR")} - ${new Date(challenge.fightTime).toLocaleTimeString("fa-IR")} (${challenge.location.gameNet})`}
          </div>
          
          {expirationInfo && expirationInfo.expired && (
            <div className='text-xs text-red-300 font-bold bg-red-900/50 px-2 py-1 rounded'>
              این چالش منقضی شده و به زودی رد خواهد شد
            </div>
          )}
      </div>
    </>
  )
}

export default ChallengeBox