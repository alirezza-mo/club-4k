"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CommentsPage() {
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchComments = async (page = 1) => {
    const res = await axios.get(`/api/comment?page=${page}`);

    setComments(res.data.comments);
    setTotal(res.data.total);
  };

  useEffect(() => {
    fetchComments(page);
  }, [page]);

  const submitComment = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/comment", { message });
      alert(res.data.message);
      setMessage("");
    } catch (err) {
      alert(err.response?.data?.error || "خطا در ارسال");
    }
  };

  const totalPages = Math.ceil(total / 10);

  return (
    <div className="w-full mx-auto flex flex-col items-center py-8 px-4 mt-32">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">نظرات کاربران</h1>

      <form
        onSubmit={submitComment}
        className="w-full mb-6 flex flex-col items-center justify-center"
      >
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className=" w-[300px] md:w-[600px] p-2 border border-gray-600 outline-none  rounded-md dark:text-white placeholder:text-gray-500 "
          placeholder="نظر خود را بنویسید..."
        ></textarea>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
        >
          ارسال نظر
        </button>
      </form>

      <div className="w-full space-y-4  flex justify-center items-center gap-5 flex-wrap">
        {comments.map((comment) => (
          <div
            key={comment._id}
            className="p-3  rounded w-full bg-white max-w-[400px] h-auto break-words"
          >
            <p className="font-semibold text-orange-600 dark:text-gold">
              {comment.user?.userName || "کاربر"}
            </p>
            <p className="text-sm break-words whitespace-pre-wrap dark:text-white">
              {comment.message}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {new Date(comment.createdAt).toLocaleString("fa-IR")}
            </p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 justify-center mt-6">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`px-3 py-1 rounded ${
              p === page ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
