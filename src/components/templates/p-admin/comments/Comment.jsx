"use client";

import { useEffect, useState, useMemo } from "react";
import fetchWithRefresh from "@/utils/fetchWithRefresh";

export default function AdminCommentsPage() {
  const [comments, setComments] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const loadComments = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetchWithRefresh(`/api/comment?page=${page}`, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "خطا در دریافت کامنت‌ها");
      // comments are populated with user.userName
      const mapped = (data.comments || []).map((c) => ({
        id: c._id,
        user: c.user?.userName || "کاربر ناشناس",
        content: c.message,
        createdAt: c.createdAt,
        isApproved: !!c.isAccept,
      }));
      setComments(mapped);
      setTotal(data.total || 0);
    } catch (err) {
      setMessage({ type: "error", text: err.message || "خطا" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments(currentPage);
  }, [currentPage]);

  const handleToggleApproval = async (id, current) => {
    setActionLoading(true);
    try {
      const res = await fetchWithRefresh(`/api/admin/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAccept: !current }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "خطا در عملیات");
      setMessage({ type: "success", text: !current ? "کامنت تأیید شد" : "تأیید لغو شد" });
      // reload current page
      await loadComments(currentPage);
    } catch (err) {
      setMessage({ type: "error", text: err.message || "خطا" });
    } finally {
      setActionLoading(false);
      setTimeout(() => setMessage(null), 2500);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("آیا از حذف این کامنت مطمئن هستید؟")) return;
    setActionLoading(true);
    try {
      const res = await fetchWithRefresh(`/api/admin/comments/${id}`, { method: "DELETE", credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "خطا در حذف");
      setMessage({ type: "success", text: "کامنت حذف شد" });
      // after delete reload - if last item on page was removed, adjust page
      const remaining = total - 1;
      const lastPage = Math.max(1, Math.ceil(remaining / itemsPerPage));
      if (currentPage > lastPage) setCurrentPage(lastPage);
      else await loadComments(currentPage);
      setTotal(remaining);
    } catch (err) {
      setMessage({ type: "error", text: err.message || "خطا" });
    } finally {
      setActionLoading(false);
      setTimeout(() => setMessage(null), 2500);
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

  const totalPages = Math.max(1, Math.ceil((total || 0) / itemsPerPage));

  const paginatedComments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredComments.slice(start, start + itemsPerPage);
  }, [filteredComments, currentPage]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-orange-600 dark:text-yellow-400">مدیریت کامنت‌ها</h2>

      {/* فیلتر و جستجو */}
      <div className=" px-2 w-full flex flex-col md:flex-row gap-4 mb-6">
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
      <div className="overflow-x-scroll rounded-lg shadow">
        <table className="min-w-full text-sm text-right bg-white dark:bg-gray-900 overflow-x-scroll">
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
            {loading ? (
              <tr><td colSpan="5" className="text-center py-6">در حال بارگذاری...</td></tr>
            ) : paginatedComments.length > 0 ? (
              paginatedComments.map((comment) => (
                <tr key={comment.id} className="border-b border-gray-200 dark:text-white dark:border-gray-700">
                  <td className="py-3 px-4">{comment.user}</td>
                  <td className="py-3 px-4 truncate max-w-xl">{comment.content}</td>
                  <td className="py-3 px-4">{new Date(comment.createdAt).toLocaleString("fa-IR")}</td>
                  <td className="py-3 px-4">
                    {comment.isApproved ? (
                      <span className="text-green-600 font-bold">تأیید شده</span>
                    ) : (
                      <span className="text-red-500 font-bold">در انتظار</span>
                    )}
                  </td>
                  <td className="py-3 px-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleToggleApproval(comment.id, comment.isApproved)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      disabled={actionLoading}
                    >
                      {comment.isApproved ? "لغو تأیید" : "تأیید"}
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      disabled={actionLoading}
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500 dark:text-gray-300">کامنتی یافت نشد.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: totalPages }).map((_, i) => (
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

      {message && <div className={`mt-4 p-3 rounded ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{message.text}</div>}
    </div>
  );
}
