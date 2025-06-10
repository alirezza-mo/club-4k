import React from 'react'

function ChallengeReq() {
  return (
    <div className='rounded-lg p-5 bg-white dark:bg-gray-800 flex flex-col items-center justify-center gap-6 border dark:border-gold border-orange-400'>
        <p className='text-2xl font-bold dark:text-white'> Farhad-king </p>
        <p className='dark:text-gray-400 text-gray-600 text-xs '> 1 مهر 1404 | ساعت : (19:00:00) </p>
        <div className='flex items-center justify-center gap-2'>
          <button className='px-5 py-2 cursor-pointer rounded-lg text-center bg-red-600 text-white'> رد </button>
          <button className='px-5 py-2 cursor-pointer rounded-lg text-center bg-green-600 text-white'> قبول </button>
          <button className='px-5 py-2 cursor-pointer rounded-lg text-center bg-yellow-400 text-white'> موکول </button>
        </div>
    </div>
  )
}

export default ChallengeReq