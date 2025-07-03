import Layout from '@/components/layouts/MainAdminLayout'
import ChallengeSection from '@/components/templates/p-mainAdmin/challenge/ChallengeSection'
import React from 'react'

function page() {
  return (
    <>
      <Layout>
        <div className='mt-20 p-4 w-full '>
          <ChallengeSection/>
        </div>
      </Layout>
    </>
  )
}

export default page