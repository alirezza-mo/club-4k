// components/charts/GameSessionsChart.tsx
"use client";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const GameSessionsChart = ({ data }) => {
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
        <Line
          data={{
            labels,
            datasets: [
              {
                label: "میانگین جلسات بازی کل گیم نت ها",
                data,
                borderColor: "#f97316",
                backgroundColor: "rgba(255, 193, 7, 0.3)",
                tension: 0.4,
                fill: true,
              },
            ],
          }}
          options={{
            responsive: true,
            scales: {
              x: {
                ticks: {
                  color: "#555",
                },
                grid: { display: false },
              },
              y: {
                ticks: {
                  color: "#555",
                },
                grid: { color: "#eee" },
              },
            },
            plugins: {
              legend: {
                labels: {
                  color: "#333",
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default GameSessionsChart;
