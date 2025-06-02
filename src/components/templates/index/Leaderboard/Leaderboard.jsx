import Link from 'next/link';
import React from 'react'
import { FaAnglesDown } from "react-icons/fa6";

function Leaderboard() {
  return (
    <>
      <section className='mt-14 w-full flex flex-col items-center justify-center gap-10'>
        <h3 className='text-3xl md:text-5xl font-bold text-center'> به سایت گیم نت 4K خوش آمدید </h3>
        {/* <div className='flex justify-between items-center w-full'> */}
        <h5 className='text-2xl text-orange-600' > تجربه هیجان انگیز بیشتر گیمینگ  </h5>
        <Link href={"#ranking"} className='text-3xl p-2 rounded-full bg-orange-600 text-white cursor-pointer transition-all hover:bg-transparent hover:text-orange-600'> 
        <FaAnglesDown />  
        </Link>

        {/* </div> */}
      </section>
    </>
  )
}

export default Leaderboard