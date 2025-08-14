"use client";

import { useEffect, useState } from "react";
import Select from "react-select";
import { format } from "date-fns-jalali";
import faIR from "date-fns-jalali/locale/fa-IR";

const dummySessions = [
  {
    id: 1,
    gameNet: "گیم‌نت تهران",
    user1: "علی",
    user2: "رضا",
    startedAt: "2025-06-20T13:00:00Z",
    endedAt: "2025-06-20T14:30:00Z",
    status: "finished",
  },
  {
    id: 2,
    gameNet: "گیم‌نت شیراز",
    user1: "حسام",
    user2: "مهدی",
    startedAt: "2025-06-22T16:00:00Z",
    endedAt: null,
    status: "in-progress",
  },
  // ...دیتاهای بیشتر جهت تست صفحه‌بندی
];

const GameNetSessionPage = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedGameNet, setSelectedGameNet] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setSessions(dummySessions);
  }, []);

  const gameNetOptions = [
    { label: "همه گیم‌نت‌ها", value: "all" },
    ...[...new Set(dummySessions.map((s) => s.gameNet))].map((g) => ({
      label: g,
      value: g,
    })),
  ];

  const getDuration = (start, end) => {
    if (!end) return "در حال اجرا";
    const diffMs = new Date(end) - new Date(start);
    return `${Math.floor(diffMs / 60000)} دقیقه`;
  };

  // فیلتر و جستجو
  const filteredSessions = sessions.filter((s) => {
    const matchGameNet =
      selectedGameNet?.value === "all" ||
      !selectedGameNet ||
      s.gameNet === selectedGameNet.value;
    const matchSearch = s.user1.includes(search) || s.user2.includes(search);
    return matchGameNet && matchSearch;
  });

  // صفحه‌بندی
  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage);
  const paginatedData = filteredSessions.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <section className="p-4 font-vazir">
      <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-orange-600 dark:text-yellow-400">
          جلسات کاربران
        </h2>

        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="جستجو نام کاربران"
            className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-sm"
          />
          <Select
            options={gameNetOptions}
            value={selectedGameNet}
            onChange={(val) => {
              setSelectedGameNet(val);
              setPage(1);
            }}
            placeholder="فیلتر گیم‌نت"
            className="min-w-[200px] text-right"
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-600">
        <table className="w-full text-sm">
          <thead className="bg-orange-100 dark:bg-yellow-900 text-gray-700 dark:text-yellow-300">
            <tr>
              <th className="p-3 text-right">#</th>
              <th className="p-3 text-right">کاربران</th>
              <th className="p-3 text-right">گیم‌نت</th>
              <th className="p-3 text-right">تاریخ شروع</th>
              <th className="p-3 text-right">مدت‌زمان</th>
              <th className="p-3 text-right">وضعیت</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((session, index) => (
              <tr
                key={session.id}
                className="border-t border-gray-200 dark:border-gray-700 dark:text-white"
              >
                <td className="p-2">{(page - 1) * itemsPerPage + index + 1}</td>
                <td className="p-2">
                  {session.user1} vs {session.user2}
                </td>
                <td className="p-2">{session?.gameNet}</td>
                <td className="p-2">
                  {typeof window !== "undefined"
                    ? format(
                        new Date(session.startedAt),
                        "yyyy/MM/dd - HH:mm",
                        {
                          locale: faIR,
                        }
                      )
                    : null}
                </td>

                <td className="p-2">
                  {getDuration(session.startedAt, session.endedAt)}
                </td>
                <td className="p-2">
                  {session.status === "finished" ? (
                    <span className="text-green-600 dark:text-green-400 font-semibold">
                      تمام شده
                    </span>
                  ) : (
                    <span className="text-yellow-600 dark:text-yellow-300 font-semibold">
                      در حال اجرا
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="p-4 text-center text-gray-500 dark:text-gray-400"
                >
                  جلسه‌ای یافت نشد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded-md border text-sm ${
              page === i + 1
                ? "bg-orange-500 text-white"
                : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-500"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </section>
  );
};

export default GameNetSessionPage;
