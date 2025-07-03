import Layout from '@/components/layouts/MainAdminLayout'
import GameNetAdminsPage from '@/components/templates/p-mainAdmin/admins/AdminTable'
import React from 'react'

function page() {
  return (
    <>
      <Layout>
        <div className='mt-20 p-4 w-full '>
          <GameNetAdminsPage/>
        </div>
      </Layout>
    </>
  )
}

export default page