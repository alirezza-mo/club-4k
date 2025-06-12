import Link from "next/link";
import React from "react";

function Notifications() {
    const notifications = [
    { id: '1', message: 'چلنج جدید توسط نینجا ایجاد شد', time: '۱۴۰۴/۰۳/۱۲', link: '/admin/notifications/1' },
    { id: '2', message: 'تیکت #۱۲۳۴ نیاز به پاسخ دارد', time: '۱۴۰۴/۰۳/۱۱', link: '/admin/notifications/2' },
    { id: '3', message: 'کاربر جدید ثبت‌نام کرد', time: '۱۴۰۴/۰۳/۱۰', link: '/admin/notifications/3' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-yellow-glow">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
        اعلان‌های اخیر
      </h2>
      <ul className="space-y-2">
        {notifications.map((item) => (
          <li
            key={item.id}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <Link
              href={item.link}
              className="text-orange-600 dark:text-yellow-400 hover:underline"
            >
              {item.message}
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {item.time}
            </p>
          </li>
        ))}
      </ul>
      <Link
        href="/admin/notifications"
        className="text-blue-600 dark:text-blue-600 dark:hover:text-blue-400 hover:underline mt-2 inline-block"
      >
        همه اعلان‌ها را مشاهده کنید
      </Link>
    </div>
  );
}

export default Notifications;
