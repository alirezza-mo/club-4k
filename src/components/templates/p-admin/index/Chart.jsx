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

// داده‌های نمونه (می‌تونی از API بک‌اند هم بگیری)
const userDataPerMonth = [5, 8, 12, 20, 15, 25, 18, 22, 17, 30, 28, 35];

export default function UserGrowthChart() {
  const data = {
    labels: persianMonths,
    datasets: [
      {
        label: "تعداد ثبت‌نام کاربران",
        data: userDataPerMonth,
        fill: true,
        borderColor: "#ff8800",
        backgroundColor: "rgba(205, 136, 0, 0.1)",
        tension: 0.4,
        pointBackgroundColor: "#ff8800",
        
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true, // شروع از صفر,
        responsive: true,
        ticks: {
          color: "#888",
          stepSize: 5,
        },
      },
      x: {
        ticks: {
          color: "#555",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "#333",
          font: { family: "vazir" , size: 16 },
          
        },
      },
    },
  };

  return (
    <div className="w-full max-h-[450px] py-15 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-orange-300 dark:border-gold">
      <h3 className="text-lg font-semibold text-orange-600 dark:text-gold mb-4 text-center">
        آمار ثبت‌نام کاربران در سال جاری
      </h3>
      <Line data={data} options={options} />
    </div>
  );
}
