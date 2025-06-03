import React from 'react'

function Comment() {
  return (
    <>
      <div className='w-96 h-36 p-3 bg-white rounded-lg'>
        <div className='w-full flex items-center justify-between '>
          <h4 className=' font-bold '> سیبیل کرنلی </h4> 
          <h5 className=' text-sm text-orange-700'> 1 آذر 1404 </h5> 
        </div>
        <div className=' mt-4 '>
          <h4 className='w-full h-20 text-wrap truncate'> ویژگی که از کلا کلوپی شما و سایتتون دوست دارم اینه که اینجوری بهتر میتونم علی رشیدی و احمد محمدی رو جر بدم و دیگ همه بهتر متوجه میشن ، این پادشاهی آخرش خاریه  </h4>
        </div>
      </div>
    </>
  )
}

export default Comment