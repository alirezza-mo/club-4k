import React from "react";
import moment from "jalali-moment";

export default function ChallengeArticle({
  challenge,
  handleAccept,
  handleReject,
  handleCancel,
  isInvited,
  isInviter,
}) {
  if (!challenge) return null;

  const persianDate = challenge.fightTime
    ? moment(challenge.fightTime).locale("fa").format("YYYY/MM/DD HH:mm")
    : "-";

  const isPending = challenge.status === "pending";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col gap-2 w-full">
      <div className="flex justify-between items-center">
        <span className="font-bold text-orange-600 dark:text-yellow-400">
          {challenge.invited?.userName} ➡️ {challenge.inviter?.userName} 
        </span>
        <span
          className={`px-2 py-1 rounded text-xs font-bold ${
            isPending
              ? "bg-yellow-100 text-yellow-700"
              : challenge.status === "accepted"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {isPending
            ? "در انتظار"
            : challenge.status === "accepted"
            ? "پذیرفته"
            : "رد شده"}
        </span>
      </div>
      <div className="flex flex-col gap-1 mt-2">
        <div>
          <span className="font-vazir text-gray-700 dark:text-gray-200">بازی: </span>
          <span className="font-bold">{challenge.game}</span>
        </div>
        <div>
          <span className="font-vazir text-gray-700 dark:text-gray-200">زمان: </span>
          <span className="font-bold">{persianDate}</span>
        </div>
        <div>
          <span className="font-vazir text-gray-700 dark:text-gray-200">گیم‌نت: </span>
          <span className="font-bold">{challenge.location?.gameNet || challenge.location}</span>
        </div>
        {challenge.message && (
          <div>
            <span className="font-vazir text-gray-700 dark:text-gray-200">پیام: </span>
            <span className="font-bold">{challenge.message}</span>
          </div>
        )}
        <div className="flex gap-2 mt-2">
          {/* دکمه‌های دعوت‌شده */}
          {isInvited && isPending && (
            <>
              <button
                type="button"
                onClick={() => handleAccept(challenge)}
                className="bg-green-600 text-white px-3 py-1 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                قبول
              </button>
              <button
                type="button"
                onClick={() => handleReject(challenge)}
                className="bg-red-600 text-white px-3 py-1 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                رد
              </button>
            </>
          )}
          {/* دکمه لغو برای دعوت‌کننده */}
          {isInviter && isPending && (
            <button
              type="button"
              onClick={() => handleCancel(challenge)}
              className="bg-gray-500 text-white px-3 py-1 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              لغو
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
