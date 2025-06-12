"use client";

import { useState, useEffect } from "react";

const mockChallenges = [
  {
    id: 1,
    player1: "Ali",
    player2: "Reza",
    game: "FIFA 23",
    date: "2025-06-10T15:00:00",
    status: "pending", // waiting | active | finished
    result: null,
  },
  {
    id: 2,
    player1: "asal",
    player2: "ana",
    game: "PES 24",
    date: "2025-06-11T17:00:00",
    status: "finished",
    result: "ana",
  },
];

const ChallengeAdminPage = () => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [challenges, setChallenges] = useState(mockChallenges);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filtered = challenges.filter((item) => {
    const matchesSearch =
      item.player1.toLowerCase().includes(search.toLowerCase()) ||
      item.player2.toLowerCase().includes(search.toLowerCase()) ||
      item.game.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 font-vazir w-full">
      <h1 className="text-2xl mb-4 font-bold text-gray-800 dark:text-yellow-400">
        مدیریت چلنج‌ها
      </h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="جستجوی نام یا بازی..."
          className="w-full md:w-1/2 p-2 rounded border dark:bg-gray-800 dark:text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="w-full md:w-1/3 p-2 rounded border dark:bg-gray-800 dark:text-white"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">همه وضعیت‌ها</option>
          <option value="pending">در انتظار</option>
          <option value="active">در حال اجرا</option>
          <option value="finished">تمام شده</option>
        </select>
      </div>

      <table className="min-w-full text-sm md:text-base border-separate border-spacing-y-2 overflow-scroll ">
        <thead>
          <tr className="bg-orange-600 dark:bg-yellow-500 text-white dark:text-black rounded">
            <th className="p-3 rounded-s-md">#</th>
            <th>کاربر اول</th>
            <th>کاربر دوم</th>
            <th>بازی</th>
            <th>تاریخ شروع</th>
            <th>وضعیت</th>
            <th className="rounded-e-md">نتیجه</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((item, index) => (
            <tr
              key={item.id}
              className="bg-white dark:bg-gray-900 hover:bg-orange-100 dark:hover:bg-yellow-800 text-center shadow rounded"
            >
              <td className="p-3 font-bold text-gray-800 dark:text-yellow-300">
                {(currentPage - 1) * itemsPerPage + index + 1}
              </td>
              <td className="text-gray-700 dark:text-yellow-200">
                {item.player1}
              </td>
              <td className="text-gray-700 dark:text-yellow-200">
                {item.player2}
              </td>
              <td className="text-gray-700 dark:text-yellow-200">
                {item.game}
              </td>
              <td className="text-gray-600 dark:text-yellow-300">
                {new Date(item.date).toLocaleString("fa-IR")}
              </td>
              <td>
                <span
                  className={`text-xs md:text-sm px-3 py-1 rounded-full font-semibold ${
                    item.status === "pending"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100"
                      : item.status === "active"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100"
                      : "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100"
                  }`}
                >
                  {item.status === "pending" && "در انتظار"}
                  {item.status === "active" && "در حال اجرا"}
                  {item.status === "finished" && "تمام شده"}
                </span>
              </td>
              <td className="text-gray-800 dark:text-yellow-300">
                {item.result ? item.result : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-6 flex justify-center gap-2">
        {Array.from(
          { length: Math.ceil(filtered.length / itemsPerPage) },
          (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded ${
                currentPage === i + 1
                  ? "bg-orange-600 text-white dark:bg-yellow-500 dark:text-black"
                  : "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-white"
              }`}
            >
              {i + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default ChallengeAdminPage;
