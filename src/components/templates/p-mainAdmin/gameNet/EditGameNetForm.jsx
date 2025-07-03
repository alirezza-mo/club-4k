"use client";


import { useState } from "react";

export default function EditGameNetForm({ gameNet }) {
  
  const [formData, setFormData] = useState({
    name: gameNet.name,
    code: gameNet.code,
    ownerName: gameNet.ownerName,
    ownerPhone: gameNet.ownerPhone,
    status: gameNet.status,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // ارسال درخواست PUT/POST به API برای ویرایش
    console.log("ویرایش گیم‌نت:", formData);

    // router.push("/main-admin/game-net");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md"
    >
      <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
        ویرایش گیم‌نت
      </h2>

      <div>
        <label className="block mb-1 text-gray-700 dark:text-gray-300">
          نام گیم‌نت
        </label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-700"
        />
      </div>

      <div>
        <label className="block mb-1 text-gray-700 dark:text-gray-300">
          کد گیم‌نت
        </label>
        <input
          name="code"
          value={formData.code}
          onChange={handleChange}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-700"
        />
      </div>

      <div>
        <label className="block mb-1 text-gray-700 dark:text-gray-300">
          نام مدیر
        </label>
        <input
          name="ownerName"
          value={formData.ownerName}
          onChange={handleChange}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-700"
        />
      </div>

      <div>
        <label className="block mb-1 text-gray-700 dark:text-gray-300">
          شماره تماس
        </label>
        <input
          name="ownerPhone"
          value={formData.ownerPhone}
          onChange={handleChange}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-700"
        />
      </div>

      <div>
        <label className="block mb-1 text-gray-700 dark:text-gray-300">
          وضعیت
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-700"
        >
          <option value="active">فعال</option>
          <option value="inactive">غیرفعال</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition"
      >
        ثبت تغییرات
      </button>
    </form>
  );
}
