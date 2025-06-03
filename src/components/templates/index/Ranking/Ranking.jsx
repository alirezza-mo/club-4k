import RankingChart from '@/components/modules/RankingChart/RankingChart';
import Link from 'next/link'
import React from 'react'
import { GiRank3 } from "react-icons/gi";

function Ranking() {
  return (
    <>
      <section id='ranking' className='mt-20 w-full '>
        <div className='w-full flex justify-between items-center text-xl sm:text-2xl'>
          <h3 className=' font-bold flex items-center gap-2 border-b-4 border-orange-600 pb-2 hover:border-none dark:border-gold dark:text-white '> برگزیدگان این ماه 
            <GiRank3 />
          </h3>
          <Link href={"#"} className=' text-lg p-2 rounded-lg dark:bg-gold dark:text-black bg-orange-600 text-white transition-all dark:hover:bg-transparent hover:bg-transparent dark:active:bg-transparent active:bg-transparent dark:hover:text-gold hover:text-orange-600 dark:active:text-gold active:text-orange-600 ' > مشاهده همه ... </Link>
        </div>
        <div className='mt-14 w-full rounded-lg'>
          <RankingChart/>
        </div>
      </section>
    </>
  )
}

export default Ranking