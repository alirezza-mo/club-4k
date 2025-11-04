import React from 'react'
import EditProfileForm from '@/components/templates/p-user/EditProfile/EditProfile'
import Layout from '@/components/layouts/UserPanelLayout'
import { cookies } from 'next/headers'
import { verifyAccessToken } from '@/utils/auth'
import Users from '../../../../models/Users'
import connectToDb from '../../../../configs/db'

export default async function Page() {
  await connectToDb()

  const token = cookies().get('accessToken')?.value
  const payload = token ? verifyAccessToken(token) : null
  if (!payload) return <div>Unauthorized</div>
  const user = await Users.findById(payload.id).select('-password').lean()

  // Create a plain-JS sanitizedUser safe to pass to client components
  const sanitizedUser = user
    ? // if it's a Mongoose doc use toObject then stringify, otherwise stringify directly
      JSON.parse(JSON.stringify(typeof user.toObject === "function" ? user.toObject() : user))
    : null;

  // Optionally ensure _id and dates are strings (if you want explicit control)
  if (sanitizedUser) {
    if (sanitizedUser._id) sanitizedUser._id = String(sanitizedUser._id);
    if (sanitizedUser.createdAt) sanitizedUser.createdAt = new Date(sanitizedUser.createdAt).toISOString();
    if (sanitizedUser.updatedAt) sanitizedUser.updatedAt = new Date(sanitizedUser.updatedAt).toISOString();
  }

  return (
    <Layout>
      <div className='mt-10'>
        <EditProfileForm profile={sanitizedUser} />
      </div>
    </Layout>
  )
}