"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import fetchWithRefresh from "@/utils/fetchWithRefresh";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetchWithRefresh(`/api/admin/notifications`, { credentials: "include" });
        const data = await res.json();
        if (!mounted) return;
        if (!res.ok) {
          setError(data.error || "خطا در دریافت اعلان‌ها");
          setNotifications([]);
        } else {
          setNotifications(data.notifications || []);
        }
      } catch (err) {
        if (!mounted) return;
        setError(err.message || "خطا در دریافت اعلان‌ها");
        setNotifications([]);
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
      return dt.toLocaleString("fa-IR");
    } catch {
      return d;
    }
  };

  if (loading) return <div className="text-sm text-gray-500">در حال بارگذاری اعلان‌ها...</div>;
  if (error) return <div className="text-sm text-red-500">خطا: {error}</div>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-yellow-glow">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">اعلان‌های اخیر</h2>
      <ul className="space-y-2">
        {notifications.map((item) => (
          <li key={item.id} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <Link href={item.link || '#'} className="text-orange-600 dark:text-yellow-400 hover:underline">
              {item.message}
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(item.time)}</p>
          </li>
        ))}
      </ul>
      <Link href="/p-admin/notifications" className="text-blue-600 dark:text-blue-600 dark:hover:text-blue-400 hover:underline mt-2 inline-block">
        همه اعلان‌ها را مشاهده کنید
      </Link>
    </div>
  );
}

export default Notifications;
