'use client';

import { PolarArea } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

export default function GameSessionPolarChart({ dataPerDay }) {
  const days = [
    'شنبه',
    'یکشنبه',
    'دوشنبه',
    'سه‌شنبه',
    'چهارشنبه',
    'پنجشنبه',
    'جمعه',
  ];

  const isDark =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  const data = {
    labels: days,
    datasets: [
      {
        label: 'تعداد جلسات',
        data: days.map((day) => dataPerDay[day] || 0),
        backgroundColor: isDark
          ? [
              '#c1121f',
              '#003049',
              '#283618',
              '#219ebc',
              '#4a5759',
              '#ff006e',
              '#284b63',
            ]
          : [
              '#fcbf49',
              '#a9def9',
              '#073b4c',
              '#660708',
              '#a4161a',
              '#ba181b',
              '#e5383b',
            ],
        borderColor: isDark
          ? '#ae8625'
          : '#FF6200',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: isDark ? '#ae8625' : '#333',
          font: {
            size: 14,
          },
        },
      },
    },
    scales: {
      r: {
        angleLines: {
          color: isDark ? '#444' : '#ccc',
        },
        grid: {
          color: isDark ? '#666' : '#ddd',
        },
        pointLabels: {
          color: isDark ? '#ae8625' : '#333',
          font: {
            size: 14,
          },
        },
        ticks: {
          color: isDark ? '#ae8625' : '#333',
          backdropColor: 'transparent',
        },
      },
    },
  };

  return (
    <div className="w-full my-5 max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-orange-300 dark:border-gold">
      <h2 className="text-center text-lg font-semibold text-gray-800 dark:text-gold mb-4">
        جلسات بازی در طول هفته
      </h2>
      <PolarArea data={data} options={options} />
    </div>
  );
}
