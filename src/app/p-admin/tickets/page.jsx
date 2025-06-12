import Layout from '@/components/layouts/AdminPanelLayout'
import AdminTicketsTable from '@/components/templates/p-admin/tickets/AdminTicketsTable'
import React from 'react'

function page() {
  return (
    <Layout>
      <div className='w-full mt-10'>
        <AdminTicketsTable/>
      </div>
    </Layout>
  )
}

export default page