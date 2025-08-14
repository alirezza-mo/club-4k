// components/admin-panel/GameNetAdminsPage.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Select from "react-select";

const adminsData = [
  {
    id: "1",
    fullName: "علی رضایی",
    phone: "09121234567",
    gameNet: "گیم‌نت پلاس",
    users: 230,
    sessions: 123,
  },
  {
    id: "2",
    fullName: "سارا محمدی",
    phone: "09351234567",
    gameNet: "گیم‌نت ایران‌گیم",
    users: 110,
    sessions: 89,
  },
  // ... (از بک‌اند گرفته می‌شود)
];

export default function GameNetAdminsPage() {
  const [search, setSearch] = useState("");
  const [selectedGameNet, setSelectedGameNet] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const gameNetOptions = [
    { value: "all", label: "همه گیم‌نت‌ها" },
    { value: "گیم‌نت پلاس", label: "گیم‌نت پلاس" },
    { value: "گیم‌نت ایران‌گیم", label: "گیم‌نت ایران‌گیم" },
    // ...
  ];

  const filteredAdmins = adminsData.filter((admin) => {
    const matchesSearch = admin.fullName.includes(search);
    const matchesGameNet =
      !selectedGameNet || selectedGameNet.value === "all"
        ? true
        : admin?.gameNet === selectedGameNet.value;

    return matchesSearch && matchesGameNet;
  });

  const paginatedAdmins = filteredAdmins.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section className="p-4">
      <div className="flex items-center justify-center md:justify-between  flex-wrap">
        <h2 className="text-xl font-bold mb-4 text-orange-600 dark:text-gold">
          ادمین‌های گیم‌نت
        </h2>
        <Link
          href={"/main-admin/admins/addAdmin"}
          className="text-xl font-bold mb-4 bg-green-500 text-white p-1 rounded-lg cursor-pointer"
        >
          افزودن ادمین جدید
        </Link>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجوی ادمین..."
          className="border rounded px-4 py-2 w-full sm:w-1/2 dark:bg-neutral-900 dark:text-white"
        />

        <div className="w-full sm:w-1/2">
          <Select
            instanceId="gamenet-admin-select"
            inputId="gamenet-admin-input"
            placeholder="فیلتر بر اساس گیم‌نت"
            options={gameNetOptions}
            onChange={setSelectedGameNet}
            className="text-right"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border rounded-lg overflow-hidden text-sm">
          <thead className="bg-gray-200 dark:bg-neutral-800 text-gray-700 dark:text-gray-300">
            <tr>
              <th className="py-2 px-4 text-right">نام کامل</th>
              <th className="py-2 px-4 text-right">شماره تماس</th>
              <th className="py-2 px-4 text-right">گیم‌نت</th>
              <th className="py-2 px-4 text-right">تعداد کاربران</th>
              <th className="py-2 px-4 text-right">تعداد جلسات</th>
              <th className="py-2 px-4 text-right">عملیات</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-neutral-900 ">
            {paginatedAdmins.map((admin) => (
              <tr
                key={admin.id}
                className="border-t border-gray-300 dark:border-neutral-700 dark:text-white"
              >
                <td className="py-2 px-4">{admin.fullName}</td>
                <td className="py-2 px-4">{admin.phone}</td>
                <td className="py-2 px-4">{admin?.gameNet}</td>
                <td className="py-2 px-4">{admin.users}</td>
                <td className="py-2 px-4">{admin.sessions}</td>
                <td className="py-2 px-4 flex gap-3">
                  <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                    <FaEdit />
                  </button>
                  <button className="text-red-600 hover:text-red-800 dark:text-red-400">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="mt-4 flex justify-center gap-2 text-sm">
          {Array.from(
            { length: Math.ceil(filteredAdmins.length / itemsPerPage) },
            (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-orange-600 text-white dark:bg-gold dark:text-black"
                    : "bg-gray-200 dark:bg-neutral-800 dark:text-white"
                }`}
              >
                {i + 1}
              </button>
            )
          )}
        </div>
      </div>
    </section>
  );
}
