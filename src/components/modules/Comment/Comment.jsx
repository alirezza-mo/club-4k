import React from 'react'


async function Comment({userName , date , message}) {
   
   
  return (
    <>
      <div className='w-96 h-36 p-3 dark:bg-gray-800 bg-white rounded-lg'>
        <div className='w-full flex items-center justify-between '>
          <h4 className=' font-bold dark:text-white '> {userName} </h4> 
          <h5 className=' text-sm text-orange-700 dark:text-gold '> {new Date(date).toLocaleString("fa-IR")} </h5> 
        </div>
        <div className=' mt-4 '>
          <h4 className='w-full h-20 text-wrap truncate dark:text-white '> {message} </h4>
        </div>
      </div>
    </>
  )
}

export default Comment