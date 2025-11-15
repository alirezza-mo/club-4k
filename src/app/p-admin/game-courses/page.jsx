import Layout from '@/components/layouts/AdminPanelLayout'
import GameSessionsTable from '@/components/templates/p-admin/gameCourses/GameCourses';
import React from 'react'

function page() {
  return (
    <Layout>
      <div className='w-full mt-28 px-5'>
        <GameSessionsTable />
      </div>
    </Layout>
  )
}

export default page