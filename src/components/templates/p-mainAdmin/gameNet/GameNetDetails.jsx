"use client";

export default function GameNetDetails({ gameNet }) {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md space-y-4 w-full">
      <h2 className="text-2xl font-bold text-orange-600 dark:text-yellow-400 mb-4">جزئیات گیم‌نت</h2>

      <div className="grid sm:grid-cols-2 gap-4 text-sm sm:text-base">
        <DetailRow label="نام گیم‌نت" value={gameNet.name} />
        <DetailRow label="کد گیم‌نت" value={gameNet.code} />
        <DetailRow label="نام مدیر" value={gameNet.ownerName} />
        <DetailRow label="شماره تماس" value={gameNet.ownerPhone} />
        <DetailRow label="تاریخ عضویت" value={gameNet.createdAt} />
        <DetailRow
          label="وضعیت"
          value={
            gameNet.status === "active" ? "فعال" : "غیرفعال"
          }
        />
        <DetailRow label="تعداد کاربران" value={`${gameNet.userCount} نفر`} />
        <DetailRow label="تعداد جلسات بازی" value={`${gameNet.sessionsCount} جلسه`} /> 
        <DetailRow label="ساعات بازی" value={`${gameNet.gameTimes} دقیقه`} /> 
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-gray-600 dark:text-gray-300">{label}:</span>
      <span className="text-gray-800 dark:text-white font-medium">{value}</span>
    </div>
  );
}
