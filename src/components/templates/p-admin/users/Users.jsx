"use client";
import { useState } from "react";
import EditUserModal from "./ModalUser";
import DeleteUserModal from "./DeleteUserModal";

const usersData = [
  {
    id: 1,
    name: "علی محمدی",
    username: "alimhd",
    phone: " 09136761196 ",
    role: "کاربر",
    status: "فعال",
  },
  {
    id: 2,
    name: "فرهاد رضایی",
    username: "farhad",
    phone: "09136761996",
    role: "ادمین",
    status: "غیرفعال",
  },
  {
    id: 3,
    name: "علیرضا مرادی",
    username: "farhad",
    phone: "09136761996",
    role: "ادمین",
    status: "غیرفعال",
  },
  {
    id: 4,
    name: "رضاپوریان",
    username: "farhad",
    phone: "09136761996",
    role: "ادمین",
    status: "غیرفعال",
  },
  {
    id: 5,
    name: "رضا",
    username: "farhad",
    phone: "09136761996",
    role: "ادمین",
    status: "غیرفعال",
  },
  {
    id: 6,
    name: "علی",
    username: "farhad",
    phone: "09136761996",
    role: "ادمین",
    status: "غیرفعال",
  },
];

const USERS_PER_PAGE = 5;

export default function AdminUsersPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(usersData.length / USERS_PER_PAGE);

  const usersToShow = usersData.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };
  const [editingUser, setEditingUser] = useState(null);

  const handleSaveUser = (updatedUser) => {
    console.log("Updated user:", updatedUser);
  };

  const [deletingUser, setDeletingUser] = useState(null);

  const handleDeleteUser = async (userId) => {
    // اینجا می‌تونی API call بزنی یا state رو آپدیت کنی
    console.log("کاربر حذف شد:", userId);
    // مثلاً:
    // await fetch(`/api/users/${userId}`, { method: "DELETE" });
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 font-vazir text-sm sm:text-base">
      <h1 className="text-xl sm:text-2xl mb-6 font-bold text-orange-600 dark:text-gold">
        لیست کاربران
      </h1>

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
                  >
                    ویرایش
                  </button>
                  <button className="text-red-600 dark:text-red-400 hover:underline mx-1" onClick={() => setDeletingUser(user)}>
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
