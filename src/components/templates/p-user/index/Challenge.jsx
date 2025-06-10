import React from "react";

function Challenge() {
  return (
    <article className=" border-2 border-orange-600 dark:border-gold bg-white dark:bg-black/90 rounded-lg p-10 mb-4 flex flex-col gap-4 transition-all hover:scale-105">
      <div className=" rounded-lg " />
      <div className="flex justify-between items-center">
        <p className="font-vazir text-lg text-gray-700 dark:text-gray-200">
          <span className="font-bold">حریف:</span> "ناشناس"
        </p>
        <p className="font-vazir text-sm text-gray-500 dark:text-gray-400"></p>
      </div>
      <p className="font-vazir text-gray-700 dark:text-gray-200">
        <span className="font-bold">بازی:</span> fifa 2023
      </p>
      <p className="font-vazir text-gray-700 dark:text-gray-200">
        <span className="font-bold">جایزه:</span> بدون جایزه
      </p>
      <p className="font-vazir text-gray-700 dark:text-gray-200">
        <span className="font-bold">وضعیت:</span>{" "}
        <span className={"text-green-500"}>تمام‌شده</span>
      </p>
    </article>
  );
}

export default Challenge;
