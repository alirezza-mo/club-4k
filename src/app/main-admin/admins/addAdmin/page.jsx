import Layout from '@/components/layouts/MainAdminLayout'
import AddAdminForm from '@/components/templates/p-mainAdmin/admins/AddAdminForm'
import React from 'react'

function page() {
  return (
    <Layout>
      <div className='mt-20 p-4 w-full'>
        <AddAdminForm/>
      </div>
    </Layout>
  )
}

export default page