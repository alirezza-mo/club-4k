import React from 'react'
import Layout from '@/components/layouts/UserPanelLayout'
// import connectToDb from '@/configs/db'
import { cookies } from 'next/headers'
import { verifyAccessToken } from '@/utils/auth'
import Users from '../../../../models/Users'
import Ticket from './../../../../models/Ticket'
import Challenge from './../../../../models/Challenge'
import connectToDb from '../../../../configs/db'

export default async function Page() {
  await connectToDb()

  const token = cookies().get('accessToken')?.value
  const payload = token ? verifyAccessToken(token) : null
  if (!payload) return <div>Unauthorized</div>

  const user = await Users.findById(payload.id).select('-password').lean()

  const [tickets, challenges] = await Promise.all([
    Ticket.find({ user: user._id }).lean(),
    Challenge.find({ $or: [{ inviter: user._id }, { invited: user._id }] }).lean(),
  ])

  const challengesDone = challenges.filter((c) => c.status === 'accepted').length
  const challengesPending = challenges.filter((c) => c.status === 'pending').length
  const challengesRejected = challenges.filter((c) => c.status === 'rejected').length

  const statistics = [
    { label: 'امتیاز', value: user.xp || 0, bgColor: 'bg-blue-600' },
    { label: 'تعداد کل بازی ها', value: user.game || 0, bgColor: 'bg-gray-600' },
    { label: 'برد', value: user.win || 0, bgColor: 'bg-green-600' },
    { label: 'باخت', value: user.lose || 0, bgColor: 'bg-red-600' },
    { label: 'تعداد تیکت ها', value: tickets.length || 0, bgColor: 'bg-yellow-500' },
    { label: 'چلنج های انجام شده', value: challengesDone, bgColor: 'bg-gold' },
    { label: 'چلنج های لغو/رد شده', value: challengesRejected, bgColor: 'bg-orange-600' },
    { label: 'چلنج های در جریان', value: challengesPending, bgColor: 'bg-green-600' },
  ]

  return (
    <Layout>
      <div className='w-full mt-10 flex items-center justify-around flex-wrap gap-20 p-5'>
        {statistics.map((stat, index) => (
          <div
            key={index}
            className={`flex items-center justify-center gap-5 text-2xl font-bold p-3 rounded-lg ${stat.bgColor} text-white`}
          >
            <p>{stat.label}:</p>
            <p>{stat.value}</p>
          </div>
        ))}
      </div>
    </Layout>
  )
}