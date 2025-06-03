import Comment from '@/components/modules/Comment/Comment';
import Link from 'next/link'
import React from 'react'
import { FaRegComments } from "react-icons/fa";


function Comments() {
  return (
    <>
      <section className='mt-20 w-full '>
        <div className='w-full flex justify-between items-center text-xl sm:text-2xl'>
          <h3 className=' font-bold flex items-center gap-2 border-b-4 border-orange-600 pb-2 hover:border-none '> نظرات کاربران
            <FaRegComments />

          </h3>
          <Link href={"#"} className=' text-lg p-2 rounded-lg bg-orange-600 text-white transition-all hover:bg-transparent active:bg-transparent hover:text-orange-600 active:text-orange-600 ' > مشاهده همه ... </Link>
        </div>
        <div className='mt-14 w-full rounded-lg flex items-center justify-center lg:justify-between gap-5 flex-wrap'>
          <Comment/>
          <Comment/>
          <Comment/>
          <Comment/>
          <Comment/>
          <Comment/>
        </div>
      </section>
    </>
  )
}

export default Comments