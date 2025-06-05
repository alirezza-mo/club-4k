import Footer from '@/components/modules/Footer/Footer'
import Navbar from '@/components/modules/Navbar/Navbar'
import LeaderboardCard from '@/components/templates/ranking/RankBox'
import RankFilterSelect from '@/components/templates/ranking/RankFilter'
import SelectDropdown from '@/components/templates/ranking/SelectDropDown'
import React from 'react'

function page() {

    const topPlayers = [
    { rank: 1, name: ' علیرضا هخامنش', score: 1250, avatar: '/images/user.jpg' },
    { rank: 2, name: 'محسن ', score: 1100, avatar: '/images/user.jpg' },
    { rank: 3, name: 'رضا', score: 950, avatar: '/images/user.jpg' },
    { rank: 5, name: 'کسری فیفا', score: 800, avatar: '/images/user.jpg' },
    { rank: 6, name: 'کسری فیفا', score: 800, avatar: '/images/user.jpg' },
    { rank: 7, name: 'کسری فیفا', score: 800, avatar: '/images/user.jpg' },
    { rank: 8, name: 'کسری فیفا', score: 800, avatar: '/images/user.jpg' },
    { rank: 9, name: 'کسری فیفا', score: 800, avatar: '/images/user.jpg' },
    { rank: 10, name: 'کسری فیفا', score: 800, avatar: '/images/user.jpg' },
    { rank: 11, name: 'کسری فیفا', score: 800, avatar: '/images/user.jpg' },
    { rank: 12, name: 'کسری فیفا', score: 800, avatar: '/images/user.jpg' },
    { rank: 14, name: 'کسری فیفا', score: 800, avatar: '/images/user.jpg' },
    { rank: 15, name: 'کسری فیفا', score: 800, avatar: '/images/user.jpg' },
  ];


  return (
    <>
      <main className='relative bg-lime-200 dark:bg-black/95 '>
        <Navbar/>
        <div className='container flex flex-col gap-10 items-center justify-center  '>
          <div className='flex lg:flex-row flex-col items-start'>
            <div className='flex flex-col gap-10 w-80 mt-52  lg:mt-32 '>
            <SelectDropdown/>
            <RankFilterSelect/>
          </div>
          <div className='w-full flex flex-wrap items-center justify-center gap-5 mt-32'>
            {topPlayers.map((player) => (
              <LeaderboardCard
                key={player.rank}
                rank={player.rank}
                name={player.name}
                score={player.score}
                avatar={player.avatar}
              />
            ))}
          </div>
          </div>
          <button className=' cursor-pointer transition-all hover:scale-105 active:scale-105 p-2 rounded-lg text-center bg-orange-600 text-white dark:bg-gold ' > ادامه ... </button>
        </div>
        <Footer/>
      </main>
    </>
  )
}

export default page