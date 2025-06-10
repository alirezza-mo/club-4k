import Layout from '@/components/layouts/UserPanelLayout'
import React from 'react'

function page() {
  return (
    <Layout>
      <div className='w-full mt-10 flex items-center justify-around flex-wrap gap-20 p-5'>
        <div className='flex items-center justify-center gap-5 text-2xl font-bold p-3 rounded-lg bg-blue-600 text-white  ' >
          <p> امتیاز : </p>
          <p> 360XP </p>
        </div>
        <div className='flex items-center justify-center gap-5 text-2xl font-bold p-3 rounded-lg bg-gray-600 text-white ' >
          <p> تعداد کل بازی ها : </p>
          <p>185</p>
        </div>
        <div className='flex items-center justify-center gap-5 text-2xl font-bold p-3 rounded-lg bg-green-600 text-white' >
          <p>برد :</p>
          <p>100</p>
        </div>
        <div className='flex items-center justify-center gap-5 text-2xl font-bold p-3 rounded-lg bg-red-600 text-white ' >
          <p>باخت  : </p>
          <p>25</p>
        </div>
        <div className='flex items-center justify-center gap-5 text-2xl font-bold p-3 rounded-lg bg-yellow-500 text-white ' >
          <p>مساوی :</p>
          <p> 60 </p>
        </div>
        <div className='flex items-center justify-center gap-5 text-2xl font-bold p-3 rounded-lg bg-gray-600 text-white ' >
          <p> چلنج های شرکت کرده : </p>
          <p> 12 </p>
        </div>
        <div className='flex items-center justify-center gap-5 text-2xl font-bold p-3 rounded-lg bg-gold text-white ' >
          <p> چلنج های دعوت شده : </p>
          <p> 8 </p>
        </div>
        <div className='flex items-center justify-center gap-5 text-2xl font-bold p-3 rounded-lg bg-orange-600 text-white ' >
          <p> چلنج های دعوت کرده : </p>
          <p> 4 </p>
        </div>
        <div className='flex items-center justify-center gap-5 text-2xl font-bold p-3 rounded-lg bg-green-600 text-white' >
          <p> چلنج های برنده شده :  </p>
          <p> 10 </p>
        </div>
        <div className='flex items-center justify-center gap-5 text-2xl font-bold p-3 rounded-lg bg-red-600 text-white ' >
          <p> چلنج های باخته شده : </p>
          <p> 2 </p>
        </div>
      </div>
    </Layout>
  )
}

export default page