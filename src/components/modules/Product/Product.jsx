import Image from 'next/image'
import React from 'react'

function Product({name, price , url , img}) {
  return (
    <>
      <div className='dark:text-white w-[150px] sm:w-[260px] p-2 rounded-lg dark:bg-gray-800 bg-white flex flex-col gap-5 items-center cursor-pointer transition-all hover:scale-105 active:scale-105 '>
        <Image 
        alt='product'
          src={img}
          height={250}
          width={244}
          className='rounded-lg h-36 sm:h-72 '
        />
        <div className='px-3 flex flex-col items-center flex-wrap gap-4'>
          <p className='sm:text-base text-sm'> {name}</p>
          <p className='text-xs sm:text-sm self-end text-orange-700 dark:text-gold  '> {price} تومان </p>
        </div>
      </div>
    </>
  )
}

export default Product