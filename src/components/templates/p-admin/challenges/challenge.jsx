"use client";

import { useState } from "react";

const ChallengeAdminPage = ({ challenges = [] }) => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filtered = challenges.filter((item) => {
    const matchesSearch =
      (item.inviter?.userName || item.inviter?.userName || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.invited?.userName || item.invited?.userName || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.game || "").toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "در انتظار";
      case "accepted":
        return "پذیرفته شده";
      case "rejected":
        return "رد شده";
      default:
        return status;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100";
      case "accepted":
        return "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100";
    }
  };

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
          <option value="accepted">پذیرفته شده</option>
          <option value="rejected">رد شده</option>
        </select>
      </div>

      {challenges.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          هیچ چلنجی یافت نشد
        </div>
      ) : (
        <>
          <table className="min-w-full text-sm md:text-base border-separate border-spacing-y-2 overflow-scroll ">
            <thead>
              <tr className="bg-orange-600 dark:bg-yellow-500 text-white dark:text-black rounded">
                <th className="p-3 rounded-s-md">#</th>
                <th>کاربر اول</th>
                <th>کاربر دوم</th>
                <th>بازی</th>
                <th>مکان</th>
                <th>تاریخ شروع</th>
                <th>وضعیت</th>
                <th className="rounded-e-md">پیام</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((item, index) => (
                <tr
                  key={item._id}
                  className="bg-white dark:bg-gray-900 hover:bg-orange-100 dark:hover:bg-yellow-800 text-center shadow rounded"
                >
                  <td className="p-3 font-bold text-gray-800 dark:text-yellow-300">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="text-gray-700 dark:text-yellow-200">
                    {item.inviter?.userName || item.inviter?.name || "نامشخص"}
                  </td>
                  <td className="text-gray-700 dark:text-yellow-200">
                    {item.invited?.userName || item.invited?.name || "نامشخص"}
                  </td>
                  <td className="text-gray-700 dark:text-yellow-200">
                    {item.game || "نامشخص"}
                  </td>
                  <td className="text-gray-700 dark:text-yellow-200">
                    {item.location?.name || item.location?.gameNet || "نامشخص"}
                  </td>
                  <td className="text-gray-600 dark:text-yellow-300">
                    {item.fightTime ? new Date(item.fightTime).toLocaleString("fa-IR") : "نامشخص"}
                  </td>
                  <td>
                    <span
                      className={`text-xs md:text-sm px-3 py-1 rounded-full font-semibold ${getStatusClass(item.status)}`}
                    >
                      {getStatusText(item.status)}
                    </span>
                  </td>
                  <td className="text-gray-800 dark:text-yellow-300 max-w-xs overflow-x-auto">
                    {item.message || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {filtered.length > itemsPerPage && (
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
          )}
        </>
      )}
    </div>
  );
};

export default ChallengeAdminPage;
