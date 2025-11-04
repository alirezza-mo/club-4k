import Layout from '@/components/layouts/MainAdminLayout'
import React from 'react'
import ContactPage from '@/components/templates/p-mainAdmin/contact/ContactPage'

function page() {
  return (
    <>
      <Layout>
        <div className='mt-20 p-4 w-full '>
          <ContactPage/>
        </div>
      </Layout>
    </>
  )
}

export default page