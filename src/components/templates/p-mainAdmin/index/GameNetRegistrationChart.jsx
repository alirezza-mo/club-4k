"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const GameNetRegistrationChart = () => {
  const labels = [
    "فروردین", "اردیبهشت", "خرداد", "تیر",
    "مرداد", "شهریور", "مهر", "آبان",
    "آذر", "دی", "بهمن", "اسفند",
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "تعداد گیم‌نت‌های ملحق‌شده",
        data: [2, 0, 3, 1, 4, 2, 5, 1, 2, 0, 1, 3], // داده‌های فرضی
        backgroundColor: "#f97316", // نارنجی برای تم لایت
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: "#777",
          font: { size: 14 },
        },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#999",
          font: { size: 14 },
          stepSize: 1,
        },
        grid: { color: "#eee" },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "#333",
          font: { size: 14 },
        },
      },
    },
  };

  return (
    
    <div className="overflow-x-auto">
  <div className="min-w-[700px]">
    <Bar data={data} options={options} />
  </div>
</div>

  );
};

export default GameNetRegistrationChart;
