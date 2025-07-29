import Layout from '@/components/layouts/UserPanelLayout'
import EditProfileForm from '@/components/templates/p-user/EditProfile/EditProfile'
import React from 'react'

function page() {

      const data = {
        username: 'گیمر نینجا',
        firstName: 'علی',
        lastName: 'محمدی',
        age: 25,
        bio: 'گیمر حرفه‌ای FIFA و عاشق جملات انگیزشی!',
        avatar: '/images/default-avatar.png',
        coverPhoto: '/images/default-cover.png',
        stats: { challenges: 15, quotes: 5, wins: 10, losses: 5 },
        quotes: [
          {
            id: 1,
            username: 'گیمر نینجا',
            quote: 'هر شکست یه قدم به سمت پیروزیته!',
            createdAt: '2025-06-07T12:00:00Z',
          },
          {
            id: 2,
            username: 'گیمر نینجا',
            quote: 'تو تاریکی هم می‌تونی بدرخشی.',
            createdAt: '2025-06-06T18:00:00Z',
          },
        ],
        challenges: [
          {
            id: 1,
            opponent: 'گیمر پرو',
            game: 'FIFA 23',
            dateTime: '2025/06/08 18:00',
            prize: '100,000 تومان',
            status: 'pending',
          },
          {
            id: 2,
            opponent: 'ناشناس',
            game: 'Call of Duty',
            dateTime: '2025/06/05 20:00',
            prize: '50,000 تومان',
            status: 'completed',
          },
        ],
      };



 
  

  

  
  
  return (
    <>
      <Layout>
        <div className='mt-10'>
          <EditProfileForm />
        </div>
      </Layout>
    </>
  )
}

export default page