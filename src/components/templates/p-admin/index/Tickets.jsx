import Link from "next/link";
import React from "react";

function Tickets() {
  const tickets = [
    {
      id: "T123",
      title: "مشکل پرداخت",
      priority: "بالا",
      status: "باز",
      date: "۱۴۰۴/۰۳/۱۲",
    },
    {
      id: "T124",
      title: "باگ چلنج",
      priority: "متوسط",
      status: "در انتظار",
      date: "۱۴۰۴/۰۳/۱۱",
    },
    {
      id: "T125",
      title: "درخواست پشتیبانی",
      priority: "پایین",
      status: "باز",
      date: "۱۴۰۴/۰۳/۱۰",
    },
  ];

  return (
    <div className="bg-white my-5 dark:bg-gray-800 rounded-lg p-6 shadow-yellow-glow">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
        تیکت‌های باز
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-gray-700 dark:text-gray-700">
              <th className="px-4 py-2">شناسه</th>
              <th className="px-4 py-2">عنوان</th>
              <th className="px-4 py-2">اولویت</th>
              <th className="px-4 py-2">وضعیت</th>
              <th className="px-4 py-2">تاریخ</th>
              <th className="px-4 py-2">اقدام</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr
                key={ticket.id}
                className="border-t border-gray-200 dark:border-gray-700"
              >
                <td className="px-4 py-2 dark:text-white">{ticket.id}</td>
                <td className="px-4 py-2 dark:text-white">{ticket.title}</td>

                <td className="px-4 py-2 flex items-center justify-center">
                  <span
                    className={`px-2 py-1 rounded-full ${
                      ticket.priority === "بالا"
                        ? "bg-red-600"
                        : ticket.priority === "متوسط"
                        ? "bg-yellow-500"
                        : "bg-green-600"
                    } text-white`}
                  >
                    {ticket.priority}
                  </span>{" "}
                </td>
                <td className="px-4 py-2 dark:text-white">{ticket.status}</td>
                <td className="px-4 py-2 dark:text-white">{ticket.date}</td>
                <td className="px-4 py-2 dark:text-white">
                  <Link
                    href={`/admin/tickets/${ticket.id}`}
                    className="text-orange-600 dark:text-yellow-400 hover:underline"
                  >
                    مشاهده
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Tickets;
