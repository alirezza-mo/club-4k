import Layout from '@/components/layouts/MainAdminLayout'
import TicketsSection from '@/components/templates/p-mainAdmin/tickets/TicketsSection'
import React from 'react'

function page() {
  return (
    <Layout>
      <div className='p-4 mt-20 w-full'>
        <TicketsSection/>
      </div>
    </Layout>
  )
}

export default page