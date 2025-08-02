import Footer from '@/components/modules/Footer/Footer'
import Navbar from '@/components/modules/Navbar/Navbar'
import CommentsPage from '@/components/templates/comment/Comment'
import React from 'react'

function page() {
  return (
    <>
      <main className='relative bg-lime-100 dark:bg-black/90 min-h-screen flex flex-col justify-between'>
        <Navbar/> 
        <div className="container">
          <CommentsPage/>
        </div>
          <Footer/>
      </main>
    </>
  )
}

export default page