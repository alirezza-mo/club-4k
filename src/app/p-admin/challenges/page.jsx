import Layout from '@/components/layouts/AdminPanelLayout'
import ChallengeAdminPage from '@/components/templates/p-admin/challenges/challenge'
import React from 'react'
import ChallengeModel from '../../../../models/Challenge'
import connectToDb from '../../../../configs/db';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/utils/auth';
import GameNetModel from '../../../../models/Admin'
import { redirect } from 'next/navigation';

async function page() {
  await connectToDb();
  const token = await cookies().get("accessToken")?.value;
  if (!token) {
    redirect("/");
  }
  const payload = await verifyAccessToken(token);
  if (!payload) {
    redirect("/");
  }
  const gameNet = await GameNetModel.findOne({_id: payload.id})
  const challenges = await ChallengeModel.find({})
  .populate("inviter invited location")
  .sort({ fightTime: -1 })
  .lean()
  .limit(5)
  const serializedChallenges = JSON.parse(JSON.stringify(challenges));
  const challengesByGameNet = serializedChallenges.filter(challenge => {
    return challenge?.location.gameNet === gameNet.gameNet
  });

  return (
    <>
    <Layout>
      <div className='w-full mt-16'>
        <ChallengeAdminPage challenges={challengesByGameNet}/>
      </div>
    </Layout>
    </>
  )
}

export default page