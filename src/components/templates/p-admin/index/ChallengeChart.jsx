'use client';

import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ChallengePieChart({
  total = 30,
  success = 20,
  failed = 5,
}) {
  const pending = total - (success + failed);

  const isDark =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  const data = {
    labels: ['انجام شده', 'ناموفق', 'در انتظار'],
    datasets: [
      {
        label: 'وضعیت چلنج‌ها',
        data: [success, failed, pending],
        backgroundColor: isDark
          ? ['#ae8625', '#B22222', '#444']
          : ['#FF8C00', '#FF4C4C', '#D3D3D3'],
        borderColor: isDark
          ? ['#ae8625', '#B2222288', '#666']
          : ['#FFA50088', '#FF7F7F88', '#ccc'],
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
  };

  return (
    <div className="w-full my-5 max-w-sm mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-orange-300 dark:border-gold">
      <h2 className="text-center text-lg font-semibold text-gray-800 dark:text-yellow-300 mb-4">
        وضعیت چلنج‌ها
      </h2>
      <Pie data={data} options={options} />
    </div>
  );
}
