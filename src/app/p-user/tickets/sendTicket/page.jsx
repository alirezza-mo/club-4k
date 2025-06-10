import Layout from '@/components/layouts/UserPanelLayout'
import SupportTicketForm from '@/components/templates/p-user/tickets/SendTicket/SendTicket'
import React from 'react'

function page() {
  return (
    <>
    <Layout>
      <div className='w-full mt-5'>
        <SupportTicketForm/>
      </div>
    </Layout>
    </>
  )
}

export default page