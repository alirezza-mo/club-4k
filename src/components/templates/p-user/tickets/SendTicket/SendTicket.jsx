"use client";

import Link from "next/link";
import { useState } from "react";
import { FaUpload } from "react-icons/fa";

export default function SupportTicketForm() {
  const [form, setForm] = useState({
    subject: "",
    category: "",
    message: "",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setForm({ ...form, file: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }  
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    // ارسال داده‌ها به سرور
  };

  return (
    <section className="w-full max-w-3xl mx-auto px-4 py-6 font-vazir">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md border border-orange-100 dark:border-yellow-600 p-5">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-orange-600 dark:text-yellow-400">
            ارسال تیکت جدید
          </h2>
          <Link href={"/p-user/tickets"} className="text-blue-500 hover:text-blue-600 text-sm">
            بازگشت به تیکت‌ها
          </Link>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* انتخاب دسته‌بندی */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              دسته‌بندی تیکت:
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full bg-gray-100 dark:bg-zinc-800 border border-orange-400 dark:border-yellow-400 text-gray-800 dark:text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-yellow-400"
            >
              <option value="">انتخاب دسته‌بندی</option>
              <option value="مالی">مالی</option>
              <option value="فنی">فنی</option>
              <option value="پیشنهاد">پیشنهاد</option>
            </select>
          </div>

          {/* موضوع تیکت */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              موضوع تیکت:
            </label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="مثال: مشکل در پرداخت"
              className="w-full bg-gray-100 dark:bg-zinc-800 border border-orange-600 dark:border-gold text-gray-800 dark:text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-yellow-400"
            />
          </div>

          {/* متن تیکت */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              متن تیکت:
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows="6"
              placeholder="متن پیام خود را وارد کنید..."
              className="w-full bg-gray-100 dark:bg-zinc-800 border border-orange-600 dark:border-gold text-gray-800 dark:text-gray-200 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-yellow-400"
            ></textarea>
          </div>

          {/* فایل پیوست */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <label className="flex items-center gap-2 text-green-600 dark:text-gold cursor-pointer hover:text-green-700 dark:hover:text-yellow-400 transition">
              <FaUpload />
              <span>آپلود پیوست</span>
              <input
                type="file"
                name="file"
                onChange={handleChange}
                className="hidden"
              />
            </label>

            <button
              type="submit"
              className="bg-green-600 text-white dark:text-gray-900 dark:bg-gold hover:bg-green-700 dark:hover:bg-yellow-500 transition px-5 py-2 rounded-lg"
            >
              ارسال تیکت
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
