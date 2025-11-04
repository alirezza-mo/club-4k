// import connectToDb from '@/configs/db'
import { verifyAccessToken } from '@/utils/auth'
import Users from '../../../models/Users'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
// import UserPanelLayout from '@/components/layouts/UserPanelLayout'  // removed to avoid double Topbar
import connectToDb from '../../../configs/db'

export default async function Layout({ children }) {
  await connectToDb()

  const token = cookies().get('accessToken')?.value

  if (!token) {
    redirect('/')
  }

  let user = null
  if (token) {
    const payload = verifyAccessToken(token)
    if (payload) {
      const rawUser = await Users.findById(payload.id).select('-password').lean()
      user = JSON.parse(JSON.stringify(rawUser))
    }
  }

  if (!user) {
    redirect('/login')
  }

  // UserPanelLayout removed here to prevent duplicate Topbar.
  // Keep this wrapper minimal; if you need panel chrome (sidebar, etc.) add it here
  return (
    <div className="p-user-layout">
      {children}
    </div>
  )
}
