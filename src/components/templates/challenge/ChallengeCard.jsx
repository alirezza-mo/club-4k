"use client";

import { fetchWithRefresh } from "@/utils/getAccessToken";
import { useEffect, useState } from "react";

export default function ChallengeCard({
  challenge,
  onViewDetails,
  onAccept,
  onReject,
}) {
  const [user, setUser] = useState(null);
  // const [showDetails, setShowDetails] = useState(false);
  if (!challenge) {
    return (
      <div className="p-4 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-md">
        <p className="text-gray-500 dark:text-gray-300">
          چالشی برای نمایش وجود ندارد.
        </p>
      </div>
    );
  }
  useEffect(() => {
    fetchWithRefresh("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
      });
  }, []);
  console.log(challenge)
  
  const isInviter = challenge.inviter?.userName === user?.userName;
  const isInvited = challenge.invited?.userName === user?.userName;
  return (
  <article className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-4 flex flex-col gap-4 shadow-yellow-glow hover:shadow-bronze-glow transform transition duration-300 hover:scale-105 animate-fadeIn">
      <h3 className=" text-xl font-bold text-orange-600 dark:text-yellow-400 text-shadow-yellow-glow">
       {
        isInviter
          ? `دعوت به مبارزه  ${challenge.invited.userName}`
          : `دعوت به مبارزه توسط ${challenge.inviter.userName}`
       }
      </h3>
      <p className="font-inter text-gray-700 dark:text-gray-200">
        لوکیشن: <span className="font-bold">{challenge.location?.gameNet}</span>
      </p>
      <p className="font-inter text-gray-700 dark:text-gray-200">
        بازی: <span className="font-bold">{challenge.game}</span>
      </p>
      <p className="font-inter text-gray-700 dark:text-gray-200">
        تاریخ و زمان:{" "}
        <span className="font-bold">
          {new Date(challenge.fightTime).toLocaleString("fa-IR")}
        </span>
      </p>
      <p className="font-inter text-gray-700 dark:text-gray-200">
        وضعیت: {" "}
        <span
          className={`font-bold ${
            challenge.status === "pending"
              ? "text-yellow-500"
              : challenge.status === "accepted"
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {challenge.status === "pending"
            ? "در انتظار"
            : challenge.status === "accepted"
            ? "تأییدشده"
            : "ردشده"}
        </span>
      </p>
      <div className="flex gap-2">
        
        {challenge.status === "pending" && isInvited && (
          <button
            onClick={() => onAccept(challenge)}
            className="bg-green-600 dark:bg-green-400 text-white dark:text-gray-900  px-4 py-2 rounded-lg shadow-yellow-glow hover:shadow-bronze-glow hover:bg-green-700 dark:hover:bg-green-500 transition duration-300"
          >
            قبول
          </button>
        )}
        {challenge.status === "pending" && isInvited && (
          <button
            onClick={() => { console.log("رد شد", challenge); onReject && onReject(challenge); }}
            className="cursor-pointer bg-red-600 dark:bg-red-400 text-white dark:text-gray-900  px-4 py-2 rounded-lg shadow-yellow-glow hover:shadow-bronze-glow hover:bg-red-700 dark:hover:bg-red-500 transition duration-300"
          >
            رد
          </button>
        )}
        {challenge.status === "pending" && isInviter && (
          <button
            onClick={() => { onReject(challenge); }}
            className="bg-red-600 dark:bg-red-500 text-white dark:text-gray-900  px-4 py-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition duration-300"
          >
            لغو
          </button>
        )}
      </div>
    </article>
  );
}
