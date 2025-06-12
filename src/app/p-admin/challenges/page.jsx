import Layout from '@/components/layouts/AdminPanelLayout'
import ChallengeAdminPage from '@/components/templates/p-admin/challenges/challenge'
import React from 'react'

function page() {
  return (
    <>
    <Layout>
      <div className='w-full mt-16'>
        <ChallengeAdminPage/>
      </div>
    </Layout>
    </>
  )
}

export default page