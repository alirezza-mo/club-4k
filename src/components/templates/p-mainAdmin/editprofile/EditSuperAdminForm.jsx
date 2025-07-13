// components/Admin/EditSuperAdminForm.tsx
"use client";

import { useState } from "react";

const EditSuperAdminForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    age: "",
    email: "",
    profileImage: null,
    role: "admin",
    isActive: true,
  });

  const handleChange = (
    e
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFormData({ ...formData, profileImage: e.target.files[0] });
    }
  };

  const handleCheckboxChange = () => {
    setFormData({ ...formData, isActive: !formData.isActive });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: ارسال اطلاعات به بک‌اند
    console.log("اطلاعات ویرایش‌شده:", formData);
  };

  return (
    <section className="p-6">
      <h2 className="text-xl font-bold mb-6">ویرایش اطلاعات ادمین اصلی</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-zinc-900 p-6 rounded-md shadow"
      >
        {/* نام و نام خانوادگی */}
        <div>
          <label className="block mb-1 dark:text-white">نام و نام خانوادگی</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:text-white"
          />
        </div>

        {/* شماره تماس */}
        <div>
          <label className="block mb-1 dark:text-white">شماره تماس</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:text-white"
          />
        </div>

        {/* سن */}
        <div>
          <label className="block mb-1 dark:text-white">سن</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:text-white"
          />
        </div>

        {/* ایمیل */}
        <div>
          <label className="block mb-1 dark:text-white">ایمیل</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:text-white"
          />
        </div>

        {/* نقش */}
        <div>
          <label className="block mb-1 dark:text-white">نقش</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:text-white"
          >
            <option value="admin">ادمین کل</option>
            <option value="support">پشتیبان</option>
          </select>
        </div>

        {/* فعال / غیرفعال */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={handleCheckboxChange}
            id="isActive"
            className="w-4 h-4"
          />
          <label htmlFor="isActive" className="dark:text-white">
            ادمین فعال باشد
          </label>
        </div>

        {/* تصویر پروفایل */}
        <div className="md:col-span-2">
          <label className="block mb-1 dark:text-white">تصویر پروفایل</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file:bg-orange-500 file:text-white file:rounded file:px-3 file:py-1 dark:file:bg-yellow-500"
          />
        </div>

        {/* دکمه ثبت */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md dark:bg-yellow-500 dark:hover:bg-yellow-600"
          >
            ذخیره تغییرات
          </button>
        </div>
      </form>
    </section>
  );
};

export default EditSuperAdminForm;
