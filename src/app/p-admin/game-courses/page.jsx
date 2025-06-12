import Layout from '@/components/layouts/AdminPanelLayout'
import GameSessionsTable from '@/components/templates/p-admin/gameCourses/GameCourses';
import React from 'react'

function page() {
  const mockSessions = [
  {
    id: 1,
    game: "FIFA 23",
    player1: "Ali",
    player2: "Reza",
    start: "1403/03/20 - 14:30",
    end: "1403/03/20 - 15:10",
    status: "finished",
  },
  {
    id: 2,
    game: "PES 2021",
    player1: "Hamed",
    player2: "Sina",
    start: "1403/03/21 - 13:00",
    end: null,
    status: "active",
  },
];

  return (
    <Layout>
      <div className='w-full mt-28 px-5'>
        <GameSessionsTable sessions={mockSessions} />
      </div>
    </Layout>
  )
}

export default page