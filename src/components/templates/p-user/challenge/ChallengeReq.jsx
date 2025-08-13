"use client"
import React, { useState } from 'react'

function ChallengeReq({challenge}) {
  const [status, setStatus] = useState(challenge.status);

  const handleAccept = async () => {
    const res = await fetch(`/api/challenge/${challenge._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status: 'accepted' })
    });
    if (res.ok) setStatus('accepted');
  };

  const handleReject = async () => {
    const res = await fetch(`/api/challenge/${challenge._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status: 'rejected' })
    });
    if (res.ok) setStatus('rejected');
  };

  return (
    <div className='rounded-lg p-5 bg-white dark:bg-gray-800 flex flex-col items-center justify-center gap-6 border dark:border-gold border-orange-400'>
        <p className='text-2xl font-bold dark:text-white'> {challenge?.invited.userName} </p>
        <p className=' dark:text-white'> {challenge?.game} - {challenge?.location.gameNet} </p>
        <p className=' wrap-break-word dark:text-white'> {challenge?.message} </p>
        <p className='dark:text-gray-400 text-gray-600 text-xs '> {new Date(challenge?.fightTime).toLocaleString('fa-IR')} </p>
        <div className='flex items-center justify-center gap-2'>
          {status === 'pending' && (
            <>
              <button className='px-5 py-2 cursor-pointer rounded-lg text-center bg-red-600 text-white' onClick={handleReject}> رد </button>
              <button className='px-5 py-2 cursor-pointer rounded-lg text-center bg-green-600 text-white' onClick={handleAccept}> قبول </button>
            </>
          )}
          {status === 'accepted' && (
            <span className='px-5 py-2 rounded-lg bg-green-100 text-green-700 font-bold'> پذیرفته شد </span>
          )}
          {status === 'rejected' && (
            <span className='px-5 py-2 rounded-lg bg-red-100 text-red-700 font-bold'> رد شد </span>
          )}
        </div>
    </div>
  )
}

export default ChallengeReq