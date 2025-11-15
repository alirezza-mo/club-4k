"use client";
import { useEffect, useState } from "react";
import EditUserModal from "./ModalUser";
import DeleteUserModal from "./DeleteUserModal";
import fetchWithRefresh from "@/utils/fetchWithRefresh";

const DEFAULT_LIMIT = 10;

export default function AdminUsersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchWithRefresh(`/api/users?page=${currentPage}&limit=${limit}`, { credentials: "include" });
        const data = await res.json();
        if (!mounted) return;
        if (!res.ok) {
          setError(data.error || "خطا در دریافت کاربران");
          setUsersData([]);
        } else {
          // server returns { users, total, page, limit }
          const mapped = (data.users || []).map((u) => ({
            id: u._id,
            name: (u.firstName || "") + (u.lastName ? " " + u.lastName : "") || u.userName,
            username: u.userName,
            phone: u.phone || "",
            role: u.gameNet ? "کاربر" : "کاربر",
            status: u.isActive ? "فعال" : "غیرفعال",
          }));
          setUsersData(mapped);
          setTotal(data.total || 0);
        }
      } catch (err) {
        if (!mounted) return;
        setError(err.message || "خطا در دریافت کاربران");
        setUsersData([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, [currentPage, limit]);

  // helper to reload users list (resets to current page)
  const reloadUsers = () => {
    setCurrentPage(1);
    // effect will re-run because currentPage and/or limit in deps
  };

  const totalPages = Math.max(1, Math.ceil((total || 0) / limit));
  const usersToShow = usersData;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };
  const [editingUser, setEditingUser] = useState(null);

  const handleSaveUser = (updatedUser) => {
    // Call API to save changes
    (async () => {
      setActionLoading(true);
      try {
        const res = await fetchWithRefresh(`/api/users/${updatedUser.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: updatedUser.name, phone: updatedUser.phone, status: updatedUser.status }),
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) {
          setMessage({ type: "error", text: data.error || "خطا در بروزرسانی کاربر" });
        } else {
          setMessage({ type: "success", text: "ویرایش با موفقیت انجام شد." });
          // update local state (best-effort) and/or reload
          setUsersData((prev) => prev.map((u) => (u.id === updatedUser.id ? { ...u, name: data.firstName + (data.lastName ? " " + data.lastName : ""), phone: data.phone || "", status: data.isActive ? "فعال" : "غیرفعال" } : u)));
        }
      } catch (err) {
        setMessage({ type: "error", text: err.message || "خطا در بروزرسانی" });
      } finally {
        setActionLoading(false);
        // refresh list to keep consistent
        setTimeout(() => reloadUsers(), 500);
        setTimeout(() => setMessage(null), 3500);
      }
    })();
  };

  const [deletingUser, setDeletingUser] = useState(null);

  const handleDeleteUser = async (userId) => {
    setActionLoading(true);
    try {
      const res = await fetchWithRefresh(`/api/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "خطا در حذف کاربر" });
      } else {
        setMessage({ type: "success", text: "کاربر با موفقیت حذف شد." });
        setUsersData((prev) => prev.filter((u) => u.id !== userId));
        // adjust total
        setTotal((t) => Math.max(0, t - 1));
      }
    } catch (err) {
      setMessage({ type: "error", text: err.message || "خطا در حذف" });
    } finally {
      setActionLoading(false);
      setTimeout(() => setMessage(null), 3500);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 font-vazir text-sm sm:text-base">
      <h1 className="text-xl sm:text-2xl mb-6 font-bold text-orange-600 dark:text-gold">
        لیست کاربران
      </h1>

      {loading ? (
        <div className="text-sm text-gray-500">در حال بارگذاری کاربران...</div>
      ) : error ? (
        <div className="text-sm text-red-500">خطا: {error}</div>
      ) : usersToShow.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">هیچ کاربری یافت نشد.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-md border border-orange-300 dark:border-gold">
          <table className="min-w-full bg-white dark:bg-[#111] text-gray-800 dark:text-yellow-100">
          <thead>
            <tr className="bg-orange-100 dark:bg-gold">
              <th className="py-2 px-4 border-b">نام</th>
              <th className="py-2 px-4 border-b">نام کاربری</th>
              <th className="py-2 px-4 border-b">شماره تماس</th>
              <th className="py-2 px-4 border-b">نقش</th>
              <th className="py-2 px-4 border-b">وضعیت</th>
              <th className="py-2 px-4 border-b">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {usersToShow.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-orange-50 dark:hover:bg-yellow-900 transition"
              >
                <td className="py-2 px-4 border-b">{user.name}</td>
                <td className="py-2 px-4 border-b">{user.username}</td>
                <td className="py-2 px-4 border-b">{user.phone}</td>
                <td className="py-2 px-4 border-b">{user.role}</td>
                <td className="py-2 px-4 border-b">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.status === "فعال"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="text-blue-600 dark:text-gold hover:underline mx-1"
                    onClick={() => setEditingUser(user)}
                    disabled={actionLoading}
                  >
                    ویرایش
                  </button>
                  <button
                    className="text-red-600 dark:text-red-400 hover:underline mx-1"
                    onClick={() => setDeletingUser(user)}
                    disabled={actionLoading}
                  >
                    حذف
                  </button>
                  <button
                    className="text-green-600 dark:text-gold hover:underline mx-1"
                    onClick={async () => {
                      if (!confirm(`آیا کاربر ${user.name} به ادمین تبدیل شود؟`)) return;
                      setActionLoading(true);
                      try {
                        const res = await fetchWithRefresh(`/api/users/${user.id}`, {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ name: user.name, phone: user.phone, status: user.status, promote: true }),
                          credentials: "include",
                        });
                        const data = await res.json();
                        if (!res.ok) {
                          setMessage({ type: "error", text: data.error || "خطا در تبدیل به ادمین" });
                        } else {
                          setMessage({ type: "success", text: data.admin && data.admin.note === "already_exists" ? "کاربر قبلاً ادمین است." : "کاربر به ادمین تبدیل شد." });
                        }
                      } catch (err) {
                        setMessage({ type: "error", text: err.message || "خطا در تبدیل" });
                      } finally {
                        setActionLoading(false);
                        setTimeout(() => setMessage(null), 3500);
                      }
                    }}
                    disabled={actionLoading}
                  >
                    تبدیل به ادمین
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center gap-3 mt-3">
        <label className="text-sm">تعداد در هر صفحه:</label>
        <select value={limit} onChange={(e) => setLimit(parseInt(e.target.value, 10))} className="px-2 py-1 rounded border">
          {[5,10,20,50].map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
        <div className="text-sm text-gray-600">مجموع: {total}</div>
      </div>

      {message && (
        <div className={`mt-4 p-3 rounded ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{message.text}</div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-3 py-1 rounded bg-orange-200 dark:bg-gold hover:bg-orange-300 dark:hover:bg-yellow-600 text-sm"
          disabled={currentPage === 1}
        >
          قبلی
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? "bg-orange-600 dark:bg-gold text-white"
                : "bg-orange-100 dark:bg-yellow-700"
            } text-sm`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-3 py-1 rounded bg-orange-200 dark:bg-gold hover:bg-orange-300 dark:hover:bg-yellow-600 text-sm"
          disabled={currentPage === totalPages}
        >
          بعدی
        </button>
      </div>

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleSaveUser}
        />
      )}
      {deletingUser && (
        <DeleteUserModal
          user={deletingUser}
          onClose={() => setDeletingUser(null)}
          onConfirm={handleDeleteUser}
        />
      )}
    </div>
  );
}
