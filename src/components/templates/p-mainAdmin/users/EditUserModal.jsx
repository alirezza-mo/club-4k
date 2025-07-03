"use client";
import { useState } from "react";

export default function EditUserModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({ ...user });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-900 text-black dark:text-white p-6 rounded-xl w-[90%] max-w-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">ویرایش اطلاعات کاربر</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="fullName"
            placeholder="نام و نام خانوادگی"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
          />
          <input
            type="number"
            name="age"
            placeholder="سن"
            value={formData.age}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
          />
          <input
            type="text"
            name="phone"
            placeholder="شماره تماس"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
          />
          <input
            type="text"
            name="gameNetName"
            placeholder="نام گیم‌نت"
            value={formData.gameNetName}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
          />
          <input
            type="text"
            name="gameNetCode"
            placeholder="کد گیم‌نت"
            value={formData.gameNetCode}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
          />

          <div className="flex gap-4 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-lg"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              ذخیره
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
