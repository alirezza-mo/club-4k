import Layout from '@/components/layouts/MainAdminLayout'
import GameNetsPage from '@/components/templates/p-mainAdmin/gameNet/GameNetsPage'
import React from 'react'

function page() {
  return (
    <Layout>
      <div className='flex flex-col p-5 mt-20 w-full'>
        <GameNetsPage/>
      </div>
    </Layout>
  )
}

export default page