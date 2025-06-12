"use client";
import { useState, useMemo } from "react";

const sampleComments = [
  // این داده‌ها صرفاً تستی هستن، بعداً از API بگیر
  
  { id: 1, user: "احمد اسموک", content: "هر شکست آغاز گارس های جدید است.", createdAt: "2025-06-16T14:10:00", isApproved: false },
  { id: 2, user: "ali", content: " من آدم آرومیم بازی نکن با روحیم ", createdAt: "2025-06-17T16:30:00", isApproved: true },
];

export default function AdminCommentsPage() {
  const [comments, setComments] = useState(sampleComments);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleToggleApproval = (id) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, isApproved: !c.isApproved } : c
      )
    );
  };

  const handleDelete = (id) => {
    if (window.confirm("آیا از حذف این کامنت مطمئن هستید؟")) {
      setComments((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const filteredComments = useMemo(() => {
    return comments.filter((comment) => {
      const matchesSearch =
        comment.user.toLowerCase().includes(search.toLowerCase()) ||
        comment.content.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "approved" && comment.isApproved) ||
        (statusFilter === "pending" && !comment.isApproved);

      return matchesSearch && matchesStatus;
    });
  }, [comments, search, statusFilter]);

  const totalPages = Math.ceil(filteredComments.length / itemsPerPage);

  const paginatedComments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredComments.slice(start, start + itemsPerPage);
  }, [filteredComments, currentPage]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-orange-600 dark:text-yellow-400">مدیریت کامنت‌ها</h2>

      {/* فیلتر و جستجو */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="جستجو بر اساس کاربر یا متن..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded w-full md:w-1/2 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        >
          <option value="all">همه وضعیت‌ها</option>
          <option value="approved">تأیید شده</option>
          <option value="pending">در انتظار تأیید</option>
        </select>
      </div>

      {/* جدول */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full text-sm text-right bg-white dark:bg-gray-900">
          <thead>
            <tr className="bg-orange-100 dark:bg-gold text-orange-800 dark:text-yellow-300">
              <th className="py-3 px-4">کاربر</th>
              <th className="py-3 px-4">متن کامنت</th>
              <th className="py-3 px-4">تاریخ</th>
              <th className="py-3 px-4">وضعیت</th>
              <th className="py-3 px-4">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {paginatedComments.map((comment) => (
              <tr key={comment.id} className="border-b border-gray-200 dark:text-white dark:border-gray-700">
                <td className="py-3 px-4">{comment.user}</td>
                <td className="py-3 px-4">{comment.content}</td>
                <td className="py-3 px-4">
                  {new Date(comment.createdAt).toLocaleString("fa-IR")}
                </td>
                <td className="py-3 px-4">
                  {comment.isApproved ? (
                    <span className="text-green-600 font-bold">تأیید شده</span>
                  ) : (
                    <span className="text-red-500 font-bold">در انتظار</span>
                  )}
                </td>
                <td className="py-3 px-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleToggleApproval(comment.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    {comment.isApproved ? "لغو تأیید" : "تأیید"}
                  </button>
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
            {paginatedComments.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500 dark:text-gray-300">
                  کامنتی یافت نشد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        {[...Array(totalPages).keys()].map((i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-4 py-1 rounded ${
              currentPage === i + 1
                ? "bg-orange-500 text-white dark:bg-yellow-500"
                : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
