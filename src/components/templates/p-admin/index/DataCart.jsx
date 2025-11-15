"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

function DataCart({ scope = "local" }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const qs = scope ? `?scope=${encodeURIComponent(scope)}` : "";
        const res = await fetchWithRefresh(`/api/admin/stats${qs}`, { credentials: "include" });
        const data = await res.json();
        if (!mounted) return;
        if (!res.ok) {
          setError(data.error || "خطا در دریافت اطلاعات");
          setStats(null);
        } else {
          const arr = [
            { title: "کاربران", value: Number(data.users || 0), icon: "👥", color: "bg-blue-600" },
            { title: "چلنج‌ها", value: Number(data.challenges || 0), icon: "🎮", color: "bg-yellow-500" },
            { title: "تیکت‌ها", value: Number(data.tickets || 0), icon: "🎫", color: "bg-red-600" },
            { title: "کامنت‌ها", value: Number(data.comments || 0), icon: "💬", color: "bg-green-600" },
          ];
          setStats(arr);
        }
      } catch (err) {
        if (!mounted) return;
        setError(err.message || "خطا در دریافت اطلاعات");
        setStats(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, [scope]);

  // helper: fetch with automatic refresh on 401
  async function fetchWithRefresh(url, opts = {}) {
    const res = await fetch(url, { ...opts });
    if (res.status !== 401) return res;

    // try refresh
    try {
      const refreshRes = await fetch("/api/auth/refresh-token", {
        method: "POST",
        credentials: "include",
      });
      if (!refreshRes.ok) {
        return res; // original 401
      }
      // retry original request once
      const retry = await fetch(url, { ...opts });
      return retry;
    } catch (err) {
      return res;
    }
  }

  const format = (num) => {
    try {
      return Number(num).toLocaleString("fa-IR");
    } catch {
      return String(num);
    }
  };

  if (loading) return <div className="text-sm text-gray-500">در حال بارگذاری...</div>;
  if (error) return <div className="text-sm text-red-500">خطا: {error}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats?.map((stat) => (
        <div key={stat.title} className="relative bg-white dark:bg-gray-800 rounded-lg p-6 animate-fadeIn">
          <div className="absolute inset-0 rounded-lg  opacity-20"></div>
          <div className="relative flex items-center gap-4">
            <span className={`text-4xl ${stat.color} p-3 rounded-full text-white`}>{stat.icon}</span>
            <div>
              <h2 className="text-lg text-gray-700 dark:text-gray-200">{stat.title}</h2>
              <p className="text-2xl font-bold text-orange-600 dark:text-gold">{format(stat.value)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DataCart;