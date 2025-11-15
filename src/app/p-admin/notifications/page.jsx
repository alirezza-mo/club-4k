"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import fetchWithRefresh from "@/utils/fetchWithRefresh";

export default function NotificationsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetchWithRefresh("/api/admin/notifications", { credentials: "include" });
        const data = await res.json();
        if (!mounted) return;
        if (!res.ok) {
          setError(data.error || "خطا در دریافت اعلان‌ها");
          setItems([]);
        } else {
          setItems(data.notifications || []);
        }
      } catch (err) {
        if (!mounted) return;
        setError(err.message || "خطا در دریافت اعلان‌ها");
        setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  const formatDate = (d) => {
    try {
      return new Date(d).toLocaleString("fa-IR");
    } catch {
      return d;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-orange-600 dark:text-gold mb-4">همه اعلان‌ها</h1>

      {loading ? (
        <div className="text-gray-500">در حال بارگذاری...</div>
      ) : error ? (
        <div className="text-red-500">خطا: {error}</div>
      ) : items.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">هیچ اعلانی یافت نشد.</div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <ul className="divide-y divide-gray-100">
            {items.map((it) => (
              <li key={it.id} className="py-3">
                <Link href={it.link || '#'} className="text-orange-600 dark:text-yellow-400 font-medium hover:underline">
                  {it.message}
                </Link>
                <div className="text-sm text-gray-500">{formatDate(it.time)}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
