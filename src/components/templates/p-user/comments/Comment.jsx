import React from 'react'

function Comment() {
  return (
    <div className="w-96 h-48 p-3 dark:bg-gold bg-orange-600 rounded-lg">
        <div className="w-full flex items-center justify-between ">
          <h4 className=" font-bold dark:text-black text-white ">
            {" "}
            احمد اسموک{" "}
          </h4>
          <h5 className=" text-sm text-gray-300 dark:text-gray-200 ">
            {" "}
            1 آذر 1404{" "}
          </h5>
        </div>
        <div className=" my-2 ">
          <h4 className=" w-full h-20 p-1 text-wrap truncate dark:text-black text-sm text-white ">
            هر شکست، قدمی به سوی پیروزی است. 
             </h4>
        </div>
        <button className='p-2 rounded-lg bg-red-600 text-white cursor-pointer'> حذف کردن </button>
      </div>
  )
}

export default Comment