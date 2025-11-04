"use client";
import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";
import Comment from "./Comment";

export default function UserPanelComments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("newest");

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      // first get current user
      const meRes = await fetch(`/api/auth/me`);
      if (!meRes.ok) {
        setComments([]);
        return;
      }
      const user = await meRes.json();
      const res = await fetch(`/api/users/${user._id}/comments?sort=${sortOrder}`);
      if (!res.ok) {
        setComments([]);
        return;
      }
      const data = await res.json();
      setComments(data.comments || []);
    } catch (err) {
      console.error(err);
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [sortOrder]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleDelete = async (id) => {
    if (!confirm("آیا مطمئن هستید که این جمله حذف شود؟")) return;
    try {
      const res = await fetch(`/api/comment/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        alert(err.message || "خطا در حذف");
        return;
      }
      // remove from state
      setComments((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
      alert("خطا در حذف");
    }
  };

  return (
    <div className="w-full">
      <div className=" flex justify-between items-center p-3 w-full border-r-8 border-orange-600 dark:border-gold">
        <h3 className="text-lg dark:text-white "> جملات من </h3>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="font-vazir bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-orange-600 dark:border-gold rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:focus:ring-gold shadow-yellow-glow transition duration-300"
          aria-label="مرتب‌سازی جملات"
        >
          <option value="newest">جدیدترین</option>
          <option value="oldest">قدیمی‌ترین</option>
        </select>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        {loading && <div className="text-gray-500">در حال بارگذاری...</div>}
        {!loading && comments.length === 0 && (
          <div className=" flex items-center justify-between gap-12 my-5">
            <p className="text-2xl dark:text-gray-400 font-bold "> تا حالا جمله‌ای ذخیره نکردی 😔 </p>
            <Link
              href={"/randomsentence"}
              className="py-1 text-white hover:text-green-500 hover:bg-transparent px-10 text-4xl rounded-lg bg-green-500"
            >
              +
            </Link>
          </div>
        )}

        {!loading && comments.map((c) => (
          <Comment key={c._id} comment={c} onDelete={() => handleDelete(c._id)} />
        ))}
      </div>

      <Link
        href={"/p-user/comments"}
        className="block text-center w-36 self-center justify-self-center my-2 text-base p-1 rounded-lg dark:bg-gold dark:text-white bg-orange-600 text-white transition-all hover:bg-transparent active:bg-transparent hover:text-orange-600 active:text-orange-600 dark:hover:bg-transparent dark:active:bg-transparent dark:hover:text-gold dark:active:text-gold"
      >
        ادامه
      </Link>
    </div>
  );
}
