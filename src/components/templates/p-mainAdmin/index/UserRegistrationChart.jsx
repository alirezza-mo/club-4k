// components/charts/UserRegistrationChart.tsx
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

const UserRegistrationChart = ({ data }) => {
  const labels = [
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

  return (
    <div className=" overflow-x-auto">
      <div className="min-w-[700px]">
        <Bar
          data={{
            labels,
            datasets: [
              {
                label: "کاربران جدید",
                data,
                backgroundColor: "#f97316",
                borderRadius: 6,
              },
            ],
          }}
          options={{
            scales: {
              x: {
                ticks: { color: "#333" },
                grid: { display: false },
              },
              y: {
                ticks: { color: "#333" },
                grid: { color: "#eee" },
              },
            },
            plugins: {
              legend: {
                labels: { color: "#333" },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default UserRegistrationChart;
