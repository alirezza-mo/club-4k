"use client";

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

// ثبت ماژول‌ها در Chart.js
ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
);

// ماه‌های شمسی
const persianMonths = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

import React, { useEffect, useState } from "react";
import fetchWithRefresh from "@/utils/fetchWithRefresh";

export default function UserGrowthChart({ scope = "local", year }) {
  const [monthsData, setMonthsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const targetYear = year || new Date().getFullYear();
        const qs = `?scope=${encodeURIComponent(scope)}&year=${encodeURIComponent(targetYear)}`;
        const res = await fetchWithRefresh(`/api/admin/stats/registrations${qs}`, { credentials: "include" });
        const data = await res.json();
        if (!mounted) return;
        if (!res.ok) {
          setError(data.error || "خطا در دریافت آمار ثبت‌نام");
          setMonthsData(null);
        } else {
          setMonthsData(data.months || []);
        }
      } catch (err) {
        if (!mounted) return;
        setError(err.message || "خطا در دریافت آمار ثبت‌نام");
        setMonthsData(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, [scope, year]);

  const options = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        responsive: true,
        ticks: { color: "#888", stepSize: 5 },
      },
      x: { ticks: { color: "#555" } },
    },
    plugins: { legend: { labels: { color: "#333", font: { family: "vazir", size: 16 } } } },
  };

  const data = {
    labels: persianMonths,
    datasets: [
      {
        label: "تعداد ثبت‌نام کاربران",
        data: monthsData || Array(12).fill(0),
        fill: true,
        borderColor: "#ff8800",
        backgroundColor: "rgba(205, 136, 0, 0.1)",
        tension: 0.4,
        pointBackgroundColor: "#ff8800",
      },
    ],
  };

  if (loading) return <div className="text-sm text-gray-500">در حال بارگذاری نمودار...</div>;
  if (error) return <div className="text-sm text-red-500">خطا: {error}</div>;

  return (
    <div className="w-full max-h-[450px] py-15 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-orange-300 dark:border-gold">
      <h3 className="text-lg font-semibold text-orange-600 dark:text-gold mb-4 text-center">آمار ثبت‌نام کاربران در سال جاری</h3>
      <Line data={data} options={options} />
    </div>
  );
}
