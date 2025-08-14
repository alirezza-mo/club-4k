"use client";

import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

const latestTickets = [
  {
    id: "1",
    gameNetName: "گیم‌نت آراد",
    title: "مشکل در ثبت جلسه بازی",
    status: "open",
    createdAt: "۱۴۰۴/۰۴/۱۱",
  },
  {
    id: "2",
    gameNetName: "گیم‌نت پارسه",
    title: "بروزرسانی پروفایل مشکل دارد",
    status: "answered",
    createdAt: "۱۴۰۴/۰۴/۱۰",
  },
  {
    id: "3",
    gameNetName: "گیم‌نت افق",
    title: "عدم دریافت پیام تایید",
    status: "open",
    createdAt: "۱۴۰۴/۰۴/۱۰",
  },
  {
    id: "4",
    gameNetName: "گیم‌نت ویرا",
    title: "خطا در بارکد",
    status: "closed",
    createdAt: "۱۴۰۴/۰۴/۰۹",
  },
  {
    id: "5",
    gameNetName: "گیم‌نت پرشین",
    title: "تیکت تست",
    status: "answered",
    createdAt: "۱۴۰۴/۰۴/۰۹",
  },
];

const statusColors = {
  open: "text-yellow-500",
  answered: "text-green-500",
  closed: "text-gray-500",
};

export default function LatestTickets() {
  return (
    <div className="w-full bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          جدیدترین تیکت‌ها
        </h2>
        <Link
          href="/admin/tickets"
          className="text-orange-600 dark:text-yellow-400 hover:underline flex items-center gap-1"
        >
          مشاهده همه <FaArrowLeft className="text-xs" />
        </Link>
      </div>

      <ul className="space-y-3">
        {latestTickets.map((ticket) => (
          <li
            key={ticket.id}
            className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="flex flex-col">
                <span className="font-medium text-gray-700 dark:text-gray-100">
                  {ticket.title}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  از: {ticket?.gameNetName}
                </span>
              </div>
              <div className="flex flex-col sm:items-end items-start">
                <span
                  className={`text-sm font-semibold ${statusColors[ticket.status]}`}
                >
                  {ticket.status === "open"
                    ? "در انتظار پاسخ"
                    : ticket.status === "answered"
                    ? "پاسخ داده‌شده"
                    : "بسته‌شده"}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {ticket.createdAt}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
