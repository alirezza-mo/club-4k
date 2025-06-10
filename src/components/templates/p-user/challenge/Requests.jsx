import React from 'react'
import ChallengeReq from './ChallengeReq'

function Requests() {
  return (
     <div className='w-full'>
      <div className='flex justify-between items-center p-3 w-full border-r-8 border-orange-600 dark:border-gold'>
        <h3 className='text-lg dark:text-white '> درخواست های رقابت </h3>
         <select
              // onClick={(e) => setSortOrder(e.target.value)}
              className="font-vazir bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-orange-600 dark:border-gold rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:focus:ring-gold shadow-yellow-glow transition duration-300"
              aria-label="مرتب‌سازی چلنج‌ها"
            >
              <option value="newest">جدیدترین</option>
              <option value="oldest">قدیمی‌ترین</option>
            </select>
            
      </div>
      <div className='flex flex-wrap items-center justify-center gap-3 px-2'>
        <ChallengeReq/> 
        <ChallengeReq/> 
        <ChallengeReq/> 
        {/* <h3 className='dark:text-gray-400 text-2xl font-bold '> درخواستی موجود نیست . </h3> */}
      </div>
       
    </div>
  )
}

export default Requests