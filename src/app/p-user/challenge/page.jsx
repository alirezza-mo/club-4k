import Layout from '@/components/layouts/UserPanelLayout'
import ChallengesDone from '@/components/templates/p-user/challenge/ChallengesDone'
import Requests from '@/components/templates/p-user/challenge/Requests'
// import Requests from '@/components/templates/p-user/challenge/challengeRequests'
import React from 'react'

function page() {
  return (
    <>
    <Layout>
      <div className='mt-5'>
        <div>
          <Requests/>
        </div>
        <div className='mt-5'>
          <ChallengesDone/>
        </div>
      </div>
    </Layout>
    </>
  )
}

export default page