"use client";
import React from "react";

export default function Comment({ comment, onDelete }) {
  const date = comment?.createdAt ? new Date(comment.createdAt).toLocaleString("fa-IR") : "";
  return (
    <div className="w-96 h-auto p-3 dark:bg-gold bg-orange-600 rounded-lg">
      <div className="w-full flex items-center justify-between ">
        <h4 className=" font-bold dark:text-black text-white ">{comment?.user?.userName || "کاربر"}</h4>
        <h5 className=" text-sm text-gray-300 dark:text-gray-200 ">{date}</h5>
      </div>
      <div className=" my-2 ">
        <h4 className=" w-full p-1 text-wrap dark:text-black text-sm text-white whitespace-pre-wrap break-words">
          {comment?.message}
        </h4>
      </div>
      {onDelete && (
        <button onClick={onDelete} className="p-2 rounded-lg bg-red-600 text-white cursor-pointer">
          حذف کردن
        </button>
      )}
    </div>
  );
}