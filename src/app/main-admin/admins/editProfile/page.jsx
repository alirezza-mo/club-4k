import Layout from '@/components/layouts/MainAdminLayout'
import EditSuperAdminForm from '@/components/templates/p-mainAdmin/editprofile/EditSuperAdminForm'
import React from 'react'

function page() {
  return (
    <Layout>
      <div className='w-full mt-20 p-4'>
        <EditSuperAdminForm/>
      </div>
    </Layout>
  )
}

export default page