import Layout from '@/components/layouts/MainAdminLayout'
import CommentsSection from '@/components/templates/p-mainAdmin/comments/CommentsSection'
import React from 'react'

function page() {
  return (
    <>
    <Layout>
      <div className='mt-20 w-full p-4'>
        <CommentsSection/>
      </div>
    </Layout>
    </>
  )
}

export default page