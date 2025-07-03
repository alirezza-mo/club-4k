import Layout from '@/components/layouts/MainAdminLayout'
import ChatRoomPage from '@/components/templates/p-mainAdmin/chatRoom/ChatRoomSection'
import React from 'react'

function page() {
  return (
    <>
      <Layout>
        <div className='mt-20 p-4 w-full '>
          <ChatRoomPage/>
        </div>
      </Layout>
    </>
  )
}

export default page