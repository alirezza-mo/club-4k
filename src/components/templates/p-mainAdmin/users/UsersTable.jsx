// app/admin/users/page.jsx
"use client";

import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import EditUserModal from "./EditUserModal";
import DeleteUserConfirm from "./DeleteUserConfirm";

const dummyUsers = [
  {
    id: 1,
    fullName: "محمد رضایی",
    age: 24,
    phone: "09123456789",
    username: "mrezaei",
    gamenet: "گیم‌نت طلایی",
    comments: 5,
    tickets: 2,
    challenges: 3,
    sessions: 8,
    totalPlayTime: 540, // به دقیقه
  },
  {
    id: 2,
    fullName: "علی کرمی",
    age: 20,
    phone: "09350000000",
    username: "alikarami",
    gamenet: "گیم‌نت نقره‌ای",
    comments: 2,
    tickets: 1,
    challenges: 1,
    sessions: 3,
    totalPlayTime: 190,
  },
  // کاربران دیگر ...
];

export default function UsersPage() {
  const [users, setUsers] = useState(dummyUsers);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const usersPerPage = 5;

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.includes(search) ||
      user.username.includes(search) ||
      user.gamenet.includes(search)
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const formatPlayTime = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs} ساعت و ${mins} دقیقه`;
  };

  const handleUpdateUser = (updatedUser) => {
    console.log(updatedUser);
    
    // ارسال به بک‌اند یا بروزرسانی لیست کاربران
    setUsers((prev) =>
      prev.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
    setShowEditModal(false);
  };

  const handleDeleteUser =  (userId) => {
    // ارسال به بک‌اند یا حذف از لیست
     setUsers((prev) => prev.filter((u) => u.id !== userId));
    setShowDeleteConfirm(false);
  };

  return (
    <div className="p-4 sm:p-6 font-vazir text-sm sm:text-base">
      <h2 className="text-xl font-bold mb-4 text-orange-600 dark:text-yellow-400">
        کاربران ثبت‌شده
      </h2>

      {/* فیلتر و جستجو */}
      <input
        type="text"
        placeholder="جستجو بر اساس نام، نام‌کاربری یا گیم‌نت..."
        className="w-full px-4 py-2 mb-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 dark:focus:ring-yellow-400"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* جدول کاربران */}
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="w-full text-center border-collapse border border-gray-300 dark:border-gray-600">
          <thead className="bg-orange-600 dark:bg-yellow-500 text-white dark:text-black">
            <tr>
              <th className="p-2">#</th>
              <th className="p-2">نام کامل</th>
              <th className="p-2">نام‌کاربری</th>
              <th className="p-2">سن</th>
              <th className="p-2">تلفن</th>
              <th className="p-2">گیم‌نت</th>
              <th className="p-2">کامنت‌ها</th>
              <th className="p-2">تیکت‌ها</th>
              <th className="p-2">چلنج‌ها</th>
              <th className="p-2">جلسات</th>
              <th className="p-2">مجموع زمان بازی</th>
              <th className="p-2">عملیات</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
            {currentUsers.map((user, index) => (
              <tr
                key={user.id}
                className="border-t border-gray-200 dark:border-gray-700"
              >
                <td className="p-2">{indexOfFirstUser + index + 1}</td>
                <td className="p-2">{user.fullName}</td>
                <td className="p-2">{user.username}</td>
                <td className="p-2">{user.age}</td>
                <td className="p-2">{user.phone}</td>
                <td className="p-2">{user.gamenet}</td>
                <td className="p-2">{user.comments}</td>
                <td className="p-2">{user.tickets}</td>
                <td className="p-2">{user.challenges}</td>
                <td className="p-2">{user.sessions}</td>
                <td className="p-2">{formatPlayTime(user.totalPlayTime)}</td>
                <td className="p-2 flex justify-center gap-2">
                  <button onClick={ () => {
                    handleUpdateUser(user)
                    setShowEditModal(true)
                  }  } className="text-blue-600 hover:text-blue-800 dark:text-yellow-400 dark:hover:text-yellow-300">
                    <FaEdit />
                  </button>
                  <button onClick={ () => {
                    handleDeleteUser(user.id)
                    setShowDeleteConfirm(true)
                  } } className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded-md ${
              currentPage === i + 1
                ? "bg-orange-600 text-white dark:bg-yellow-500 dark:text-black"
                : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
      {showEditModal && (
        <EditUserModal
          user={users}
          onClose={() => setShowEditModal(false)}
          onSave={handleUpdateUser}
        />
      )}

      {showDeleteConfirm && (
        <DeleteUserConfirm
          user={users}
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={handleDeleteUser}
        />
      )}
    </div>
  );
}
