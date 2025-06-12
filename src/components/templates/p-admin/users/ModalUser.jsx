"use client";
import { useState } from "react";

export default function EditUserModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: user.name,
    phone: user.phone,
    role: user.role,
    status: user.status,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSave({ ...user, ...formData });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-[#111] text-gray-800 dark:text-yellow-100 w-full max-w-md rounded-lg shadow-lg p-6 relative">
        <h2 className="text-lg font-bold mb-4 text-orange-600 dark:text-gold">
          ویرایش اطلاعات کاربر
        </h2>

        <div className="space-y-3">
          <div>
            <label className="block mb-1">نام کامل:</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded border dark:border-gold bg-white dark:bg-[#222]"
            />
          </div>

          <div>
            <label className="block mb-1">ایمیل:</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded border dark:border-gold bg-white dark:bg-[#222]"
            />
          </div>

          <div>
            <label className="block mb-1">نقش:</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded border dark:border-gold bg-white dark:bg-[#222]"
            >
              <option value="کاربر">کاربر</option>
              <option value="ادمین">ادمین</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">وضعیت:</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded border dark:border-gold bg-white dark:bg-[#222]"
            >
              <option value="فعال">فعال</option>
              <option value="غیرفعال">غیرفعال</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 dark:bg-red-600 hover:bg-gray-300 dark:hover:bg-red-700"
          >
            لغو
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-orange-600 dark:bg-gold text-white hover:bg-orange-700 dark:hover:bg-yellow-500"
          >
            ثبت تغییرات
          </button>
        </div>
      </div>
    </div>
  );
}
