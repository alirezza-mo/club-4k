import Image from "next/image";
import React from "react";

function NewsBox({ content, publishedAt, image }) {
  return (
    <div className="cursor-pointer w-full max-w-[600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl dark:bg-gray-900 bg-white transition-all hover:bg-orange-100 dark:hover:bg-yellow-200">
      {/* تصویر */}
      {image && (
        <div className="flex-shrink-0 w-full sm:w-1/3 flex justify-center">
          <Image
            src={`${process.env.GET_LIARA}/${image}`}
            width={120}
            height={120}
            alt="news image"
            className="rounded-2xl object-contain max-h-[120px]"
          />
        </div>
      )}

      {/* محتوا */}
      <div className={`flex flex-col justify-between gap-2 w-full ${!image ? "text-center" : ""}`}>
        {/* تگ‌ها */}
        <div className="flex flex-wrap justify-center sm:justify-start gap-2">
          <span className="text-xs text-indigo-500 bg-indigo-700/10 px-3 py-1 rounded-xl">
            اخبار
          </span>
          <span className="text-xs text-indigo-500 bg-indigo-600/10 px-3 py-1 rounded-xl">
            رقابت
          </span>
        </div>

        {/* متن خبر */}
        <p className="text-sm text-black dark:text-gray-300 leading-6 line-clamp-4">
          {content}
        </p>

        {/* تاریخ */}
        <div className="bg-gray-200 dark:bg-gray-700 text-xs text-center text-gray-800 dark:text-white rounded-xl px-4 py-1 w-fit mx-auto sm:mx-0">
          {new Date(publishedAt).toLocaleString("fa-IR")}
        </div>
      </div>
    </div>
  );
}

export default NewsBox;
  