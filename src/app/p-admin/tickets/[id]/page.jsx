import Layout from '@/components/layouts/AdminPanelLayout'
import AdminTicketView from '@/components/templates/p-admin/tickets/AnswerTicket'
import React from 'react'

function page() {
  return (
    <>
      <Layout>
        <div className='mt-20'>
          <AdminTicketView/>
        </div>
      </Layout>
    </>
  )
}

export default page