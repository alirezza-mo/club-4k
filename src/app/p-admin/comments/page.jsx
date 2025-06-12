import Layout from '@/components/layouts/AdminPanelLayout'
import AdminCommentsPage from '@/components/templates/p-admin/comments/Comment'
import React from 'react'

function page() {
  return (
    <>
      <Layout>
        <div className='w-full mt-14'>
          <AdminCommentsPage/>
        </div>
      </Layout>
    </>
  )
}

export default page