'use client';

import { useEffect, useState } from 'react';

export default function GameSessionsTable({ sessions = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter data based on search term
  useEffect(() => {
    const filtered = sessions.filter((session) => {
      const term = searchTerm.toLowerCase();
      return (
        session.player1.toLowerCase().includes(term) ||
        session.player2.toLowerCase().includes(term) ||
        session.game.toLowerCase().includes(term)
      );
    });
    setFilteredSessions(filtered);
    setCurrentPage(1); // Reset to first page on search
  }, [searchTerm, sessions]);

  const paginatedData = filteredSessions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage);

  return (
    <div className="w-full space-y-4 font-vazir">
      {/* Search input */}
      <div className="flex justify-end">
        <input
          type="text"
          placeholder="جستجو بر اساس بازیکن یا بازی..."
          className="border border-orange-500 dark:border-gold rounded px-4 py-2 w-full max-w-md bg-white dark:bg-gray-800 text-black dark:text-white placeholder:text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border overflow-x-auto border-orange-500 dark:border-gold">
          <thead className="bg-orange-600 dark:bg-yellow-600 text-white dark:text-black">
            <tr>
              <th className="px-4 py-2 text-center">#</th>
              <th className="px-4 py-2 text-center">نوع بازی</th>
              <th className="px-4 py-2 text-center">بازیکن ۱</th>
              <th className="px-4 py-2 text-center">بازیکن ۲</th>
              <th className="px-4 py-2 text-center">شروع</th>
              <th className="px-4 py-2 text-center">پایان</th>
              <th className="px-4 py-2 text-center">وضعیت</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 text-gray-800 dark:text-yellow-100">
            {paginatedData.length > 0 ? (
              paginatedData.map((session, index) => (
                <tr
                  key={session.id}
                  className="border-b border-gray-300 dark:border-gray-700 text-center"
                >
                  <td className="px-4 py-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="px-4 py-2">{session.game}</td>
                  <td className="px-4 py-2">{session.player1}</td>
                  <td className="px-4 py-2">{session.player2}</td>
                  <td className="px-4 py-2">{session.start}</td>
                  <td className="px-4 py-2">{session.end || 'در حال اجرا'}</td>
                  <td className="px-4 py-2">
                    {session.status === 'active' ? (
                      <span className="text-green-600 dark:text-green-400 font-semibold">
                        در حال اجرا
                      </span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400 font-semibold">
                        تمام شده
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500 dark:text-gray-400">
                  داده‌ای یافت نشد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            className="px-3 py-1 bg-orange-500 dark:bg-gold text-white dark:text-black rounded hover:bg-orange-600 dark:hover:bg-gold transition"
          >
            قبلی
          </button>
          <span className="text-sm text-gray-700 dark:text-yellow-100">
            صفحه {currentPage} از {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            className="px-3 py-1 bg-orange-500 dark:bg-gold text-white dark:text-black rounded hover:bg-orange-600 dark:hover:bg-yellow-600 transition"
          >
            بعدی
          </button>
        </div>
      )}
    </div>
  );
}
