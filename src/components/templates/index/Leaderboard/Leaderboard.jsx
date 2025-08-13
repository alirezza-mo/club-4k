import Link from 'next/link';
import React from 'react'
import { FaAnglesDown } from "react-icons/fa6";
import { FaPlay } from "react-icons/fa6";

function Leaderboard() {
  return (
    <>
      <section id='leaderboard' className='mt-14 w-full flex flex-col items-center justify-center gap-10'>
        <h3 className='text-3xl md:text-5xl font-bold text-center dark:text-white '> به سایت گیم نت 4K خوش آمدید </h3>
        {/* <div className='flex justify-between items-center w-full'> */}
        <h5 className='text-2xl text-orange-600 dark:text-gold' > تجربه هیجان انگیز بیشتر گیمینگ  </h5>
        <Link href={"/scan-session"} className='group relative inline-flex items-center justify-center overflow-hidden rounded-xl px-8 py-3 text-lg font-semibold transition-all duration-300 bg-gradient-to-r from-green-500 via-emerald-600 to-green-700 text-white shadow-[0_10px_30px_rgba(16,185,129,0.5)] hover:shadow-[0_14px_40px_rgba(16,185,129,0.7)] dark:from-emerald-500 dark:via-emerald-600 dark:to-emerald-700'>
          <span className='absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-0'></span>
          <FaPlay className='mr-2' />
          شروع جلسه
        </Link>
        <Link href={"#ranking"} className='text-3xl p-2 rounded-full dark:bg-gold dark:text-black bg-orange-600 text-white cursor-pointer transition-all dark:active:bg-transparent dark:hover:bg-transparent dark:active:text-gold dark:hover:text-gold hover:bg-transparent hover:text-orange-600'> 
        <FaAnglesDown />  
        </Link>

        {/* </div> */}
      </section>
    </>
  )
}

export default Leaderboard