"use client";

import Link from "next/link";
import { useState } from "react";
import { FaUpload } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function SupportTicketForm() {
  const [title , setTitle] = useState("")
  const [department , setDepartment] = useState("")
  const [body , setBody] = useState("")
  const [priority , setPriority] = useState(1) 


  const [loading, setLoading] = useState(false);
  const router = useRouter();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push("/p-user/tickets");
      } else {
        alert("خطا در ارسال تیکت");
      }
    } catch (err) {
      alert("مشکلی پیش آمده");
    } finally {
      setLoading(false);
    }
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
              name="department"
              value={department}
              onChange={e => setDepartment(e.target.value)}
              required
              className="w-full bg-gray-100 dark:bg-zinc-800 border border-orange-400 dark:border-yellow-400 text-gray-800 dark:text-gray-200 rounded-lg px-4 py-2"
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
              name="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              placeholder="مثال: مشکل در پرداخت"
              className="w-full bg-gray-100 dark:bg-zinc-800 border border-orange-600 dark:border-gold text-gray-800 dark:text-gray-200 rounded-lg px-4 py-2"
            />
          </div>

          {/* متن تیکت */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              متن تیکت:
            </label>
            <textarea
              name="body"
              value={body}
              onChange={e => setBody(e.target.value)}
              required
              rows="6"
              placeholder="متن پیام خود را وارد کنید..."
              className="w-full bg-gray-100 dark:bg-zinc-800 border border-orange-600 dark:border-gold text-gray-800 dark:text-gray-200 rounded-lg px-4 py-2 resize-none"
            ></textarea>
          </div>

          {/* اولویت */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              اولویت:
            </label>
            <select
              name="priority"
              value={priority}
              onChange={e => setPriority(e.target.value)}
              className="w-full bg-gray-100 dark:bg-zinc-800 border border-orange-400 dark:border-yellow-400 text-gray-800 dark:text-gray-200 rounded-lg px-4 py-2"
            >
              <option value={1}>کم</option>
              <option value={2}>متوسط</option>
              <option value={3}>زیاد</option>
            </select>
          </div>

          {/* دکمه ارسال */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white hover:bg-green-700 px-6 py-2 rounded-lg disabled:opacity-50"
            >
              {loading ? "در حال ارسال..." : "ارسال تیکت"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
