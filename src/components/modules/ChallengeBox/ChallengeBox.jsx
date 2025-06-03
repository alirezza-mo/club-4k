import React from 'react'
import { GiCrossedSwords } from "react-icons/gi";

function ChallengeBox() {
  return (
    <>
      <div className='p-3 sm:p-6 rounded-lg dark:bg-gold dark:text-black bg-orange-600 text-white flex flex-col items-center justify-center gap-5'>
          <div className='flex items-center justify-center gap-2 sm:gap-5 w-full font-bold'>
            <h4 className='text-xl sm:text-2xl'> Ahmad_smoke </h4>
                <GiCrossedSwords className='text-3xl sm:text-6xl p-2 rounded-full dark:bg-black dark:text-yellow-600 bg-white text-orange-800'/>
            <h4 className='text-xl sm:text-2xl'> Ali_moltafet83 </h4>
          </div>
          <div className='text-xs text-gray-300'>
             "( 21 آذر ساعت 20:00 | eFootball)"
          </div>
      </div>
    </>
  )
}

export default ChallengeBox