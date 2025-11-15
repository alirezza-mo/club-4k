"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import fetchWithRefresh from "@/utils/fetchWithRefresh";

function Tickets() {
  const [tickets, setTickets] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetchWithRefresh(`/api/admin/tickets`, { credentials: "include" });
        const data = await res.json();
        if (!mounted) return;
        if (!res.ok) {
          setError(data.error || "خطا در دریافت تیکت‌ها");
          setTickets([]);
        } else {
          setTickets(data.tickets || []);
        }
      } catch (err) {
        if (!mounted) return;
        setError(err.message || "خطا در دریافت تیکت‌ها");
        setTickets([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => (mounted = false);
  }, []);

  const formatDate = (d) => {
    try {
      const dt = new Date(d);
      return dt.toLocaleDateString("fa-IR");
    } catch {
      return d;
    }
  };

  if (loading) return <div className="text-sm text-gray-500">در حال بارگذاری تیکت‌ها...</div>;
  if (error) return <div className="text-sm text-red-500">خطا: {error}</div>;

  return (
    <div className="bg-white my-5 dark:bg-gray-800 rounded-lg p-6 shadow-yellow-glow">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">تیکت‌های باز</h2>
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
              <tr key={ticket.id} className="border-t border-gray-200 dark:border-gray-700">
                <td className="px-4 py-2 dark:text-white">{String(ticket.id).slice(-6)}</td>
                <td className="px-4 py-2 dark:text-white">{ticket.title}</td>

                <td className="px-4 py-2 flex items-center justify-center">
                  <span
                    className={`px-2 py-1 rounded-full ${
                      ticket.priority === 3
                        ? "bg-red-600"
                        : ticket.priority === 2
                        ? "bg-yellow-500"
                        : "bg-green-600"
                    } text-white`}
                  >
                    {typeof ticket.priority === "number" ? (ticket.priority === 3 ? "بالا" : ticket.priority === 2 ? "متوسط" : "پایین") : ticket.priority}
                  </span>
                </td>
                <td className="px-4 py-2 dark:text-white">{ticket.status}</td>
                <td className="px-4 py-2 dark:text-white">{formatDate(ticket.date)}</td>
                <td className="px-4 py-2 dark:text-white">
                  <Link href={`/p-admin/tickets/${ticket.id}`} className="text-orange-600 dark:text-yellow-400 hover:underline">
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
