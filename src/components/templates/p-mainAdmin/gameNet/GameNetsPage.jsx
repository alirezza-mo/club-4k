"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FaEye, FaTrash, FaEdit } from "react-icons/fa";
import DeleteGameNetButton from "./DeleteGameNet";

const mockData = [
  {
    id: "gn1",
    name: "گیم‌نت آراد",
    code: "ARAD123",
    owner: "رضا صادقی - 09121234567",
    joinedAt: "۱۴۰۳/۱۲/۲۵",
    usersCount: 34,
    status: "active",
  },
  {
    id: "gn2",
    name: "گیم‌نت پارسه",
    code: "PARSE456",
    owner: "علی مرادی - 09351234567",
    joinedAt: "۱۴۰۴/۰۱/۱۲",
    usersCount: 19,
    status: "inactive",
  },
  // ...
];

export default function GameNetsPage() {
  const [gameNets, setGameNets] = useState(mockData);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState("");

  const filtered = gameNets.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.code.toLowerCase().includes(search.toLowerCase())
  );

  const deleteHandle = (gn) => {
    setDeleteId(gn);
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md">
      <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
        لیست گیم‌نت‌ها
      </h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="جستجو بر اساس نام یا کد گیم‌نت..."
          className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-right text-gray-700 dark:text-gray-100">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              {
                deleteId && (<th> حذف </th>)
              }
              <th className="p-2">نام</th>
              <th className="p-2">کد</th>
              <th className="p-2">مدیر</th>
              <th className="p-2">تاریخ عضویت</th>
              <th className="p-2">تعداد کاربران</th>
              <th className="p-2">وضعیت</th>
              <th className="p-2">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length ? (
              filtered.map((gn) => (
                <tr key={gn.id} className="border-b dark:border-gray-700">
                  {deleteId === gn.id && (
                    <th>
                      <DeleteGameNetButton id={deleteId} />
                    </th>
                  )}

                  <td className="p-2 truncate">{gn.name}</td>
                  <td className="p-2">{gn.code}</td>
                  <td className="p-2 truncate ">{gn.owner}</td>
                  <td className="p-2">{gn.joinedAt}</td>
                  <td className="p-2">{gn.usersCount}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        gn.status === "active"
                          ? "bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-300"
                          : "bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-300"
                      }`}
                    >
                      {gn.status === "active" ? "فعال" : "غیرفعال"}
                    </span>
                  </td>
                  <td className="p-2 flex gap-2 items-center text-sm">
                    <Link
                      href={"/main-admin/game-net/gameNetDetails"}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <FaEye />
                    </Link>
                    <Link
                      href={"/main-admin/game-net/gamenetEditPage"}
                      className="text-yellow-500 dark:text-yellow-300 hover:underline"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      onClick={(e) => deleteHandle(gn.id)}
                      className="text-red-600 dark:text-red-400 hover:underline"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="text-center p-4 text-gray-400 dark:text-gray-500"
                >
                  موردی یافت نشد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
