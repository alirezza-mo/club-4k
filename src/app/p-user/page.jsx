// import connectToDb from '@/configs/db'
// import { cookies } from 'next/headers'
import { verifyAccessToken } from '@/utils/auth'
import Users from '../../../models/Users'
import Ticket from '../../../models/Ticket'
import Comment from '../../../models/Comment'
import Challenge from '../../../models/Challenge'
// import Challenges from '@components/templates/p-user/index/Challenges'
// import Comments from '@components/templates/p-user/index/Comments'
// import Tickets from '@components/templates/p-user/index/Tickets'
import connectToDb from '../../../configs/db'
import Challenges from '@/components/templates/p-user/index/Challenges'
import Comments from '@/components/templates/p-user/index/Comments'
import Tickets from '@/components/templates/p-user/index/Tickets'
import { cookies } from 'next/headers'

export default async function Page() {
  await connectToDb()

  const token = cookies().get('accessToken')?.value
  const payload = token ? verifyAccessToken(token) : null

  if (!payload) {
    return <div>Unauthorized</div>
  }

  const user = await Users.findById(payload.id).select('-password').lean()

  // Fetch user-related data
  const [tickets, challenges, comments] = await Promise.all([
    Ticket.find({ user: user._id }).sort({ createdAt: -1 }).lean(),
    Challenge.find({ $or: [{ inviter: user._id }, { invited: user._id }] })
      .sort({ fightTime: -1 })
      .lean(),
    Comment.find({ user: user._id }).sort({ createdAt: -1 }).lean(),
  ])

  const data = {
    ticketsCount: tickets.length,
    challengesCount: challenges.length,
    commentsCount: comments.length,
    xp: user.xp || 0,
    tickets,
    challenges,
    comments,
  }

  return (
    <div className="w-full mt-5">
      <div className="border-b-2 border-dashed dark:border-gold border-orange-600 w-full flex items-center justify-between p-1 sm:p-5 dark:text-gray-400 text-gray-800 text-xs sm:text-lg sm:font-bold">
        <div>
          <p> تعداد تیکت ها : {data.ticketsCount} </p>
        </div>
        <div>
          <p> تعداد چلنج ها : {data.challengesCount} </p>
        </div>
        <div>
          <p> تعداد کامنت ها : {data.commentsCount} </p>
        </div>
        <div>
          <p className="text-blue-500"> XP : {data.xp} </p>
        </div>
      </div>
      <div className="mt-10">
        {/* Tickets component may be client-only; it's ok to import client components into server components */}
        <Tickets tickets={data.tickets} />
      </div>
      <div className="mt-10">
        <Challenges challenges={data.challenges} />
      </div>
      <div className="mt-10">
        <Comments comments={data.comments} />
      </div>
    </div>
  )
}
