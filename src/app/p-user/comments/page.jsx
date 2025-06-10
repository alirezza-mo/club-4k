import Layout from '@/components/layouts/UserPanelLayout'
import UserPanelComments from '@/components/templates/p-user/comments/UserPanelComments'
import Link from 'next/link'
import React from 'react'

function page() {
  return (
    <>
      <Layout>
        <div className='mt-16 flex flex-col items-center'>
          <UserPanelComments/>
          <Link href={"/randomsentence"} className='my-10 px-10 py-2 rounded-lg bg-green-600 text-white text-2xl'> افزودن یک جمله </Link>
        </div>
      </Layout>
    </>
  )
}

export default page