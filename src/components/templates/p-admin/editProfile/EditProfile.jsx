"use client";

import { useState } from "react";

export default function AdminProfileEditForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    phone: "",
    profileImage: null,
    gameNetName: "",
    gameNetCode: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage") {
      setFormData({ ...formData, profileImage: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("فرم ارسال شد:", formData);
    // ارسال به بک‌اند در آینده
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl w-full mx-auto p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-lg font-vazir"
    >
      <h2 className="text-2xl font-bold mb-6 text-orange-600 dark:text-yellow-400 text-center">
        ویرایش اطلاعات ادمین
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
            نام و نام خانوادگی
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md bg-white dark:bg-zinc-800 border-orange-600 dark:border-yellow-400 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:focus:ring-yellow-400"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
            سن
          </label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md bg-white dark:bg-zinc-800 border-orange-600 dark:border-yellow-400 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:focus:ring-yellow-400"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
            شماره تماس
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md bg-white dark:bg-zinc-800 border-orange-600 dark:border-yellow-400 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:focus:ring-yellow-400"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
            تصویر پروفایل
          </label>
          <input
            type="file"
            accept="images/*"
            name="profileImage"
            onChange={handleChange}
            className="block w-full text-sm text-gray-700 dark:text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-600 file:text-white dark:file:bg-yellow-500 dark:file:text-black hover:file:bg-orange-700 dark:hover:file:bg-yellow-600"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
            نام گیم‌نت
          </label>
          <input
            type="text"
            name="gameNetName"
            value={formData.gameNetName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md bg-white dark:bg-zinc-800 border-orange-600 dark:border-yellow-400 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:focus:ring-yellow-400"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
            کد گیم‌نت
          </label>
          <input
            type="text"
            name="gameNetCode"
            value={formData.gameNetCode}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md bg-white dark:bg-zinc-800 border-orange-600 dark:border-yellow-400 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:focus:ring-yellow-400"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 w-full bg-orange-600 dark:bg-yellow-400 text-white dark:text-black font-semibold py-3 px-4 rounded-md hover:bg-orange-700 dark:hover:bg-yellow-500 transition duration-300"
      >
        ذخیره اطلاعات
      </button>
    </form>
  );
}
