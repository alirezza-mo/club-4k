import React from 'react'
import Ticket from '../../../modules/p-user/Ticket'

function Tickets() {
  return (
    <div className='w-full'>
      <div className='flex justify-between items-center p-3 w-full border-r-8 border-orange-600 dark:border-gold'>
        <h3 className='text-lg dark:text-white '> تیکت ها من </h3>
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
        <Ticket/>
        <Ticket/>
        <Ticket/>
      </div>
       
    </div>
  )
}

export default Tickets