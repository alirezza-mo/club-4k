import Layout from '@/components/layouts/UserPanelLayout'
import EditProfileForm from '@/components/templates/p-user/EditProfile/EditProfile'
import React from 'react'

function page() {


  return (
    <>
      <Layout>
        <div className='mt-10'>
          <EditProfileForm />
        </div>
      </Layout>
    </>
  )
}

export default page