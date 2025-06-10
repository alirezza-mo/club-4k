import React from 'react'
import { SiTicktick } from "react-icons/si";

function Ticket() {
  return (
    <>
      <div className='w-full dark:bg-gray-900 dark:text-white bg-white flex items-center gap-3 justify-between p-3 m-2 rounded-lg'>
        <p className='sm:text-base text-xs truncate '> درخواست بازبینی امتیازات و ارائه آن به همه</p>
        <div className='flex items-center gap-5 sm:text-base text-xs'>
          <p> پشتیبانی  </p>
          <p> 1 آذر 1403 (20:00:00) </p>
          <SiTicktick className='text-green-600'/>
        </div>
      </div>
    </>
  )
}

export default Ticket