import Link from "next/link";
import React from "react";
import Comment from "./Comment";

function Comments() {
  return (
    <>
      <div className="w-full">
        <div className="flex justify-between items-center p-3 w-full border-r-8 border-orange-600 dark:border-gold">
          <h3 className="text-lg dark:text-white "> جملات من  </h3>
          <select
            // onClick={(e) => setSortOrder(e.target.value)}
            className="font-vazir bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-orange-600 dark:border-gold rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:focus:ring-gold shadow-yellow-glow transition duration-300"
            aria-label="مرتب‌سازی چلنج‌ها"
          >
            <option value="newest">جدیدترین</option>
            <option value="oldest">قدیمی‌ترین</option>
          </select>
          <Link
            href={"/p-user/comments"}
            className=" sm:block hidden text-base p-1 rounded-lg dark:bg-gold dark:text-white bg-orange-600 text-white transition-all hover:bg-transparent active:bg-transparent hover:text-orange-600 active:text-orange-600 dark:hover:bg-transparent dark:active:bg-transparent dark:hover:text-gold dark:active:text-gold"
          >
            {" "}
            مشاهده همه ...{" "}
          </Link>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* <Comment/>
          <Comment/>
          <Comment/>
          <Comment/>
          <Comment/>
          <Comment/> */}
          <div className=" flex items-center justify-between gap-12 my-5">
            <p className="text-2xl dark:text-gray-400 font-bold "> تا حالا واسه ما جمله نذاشتی 😔 </p>
            <Link href={'/randomsentence'} className="py-1 text-white hover:text-green-500 hover:bg-transparent px-10 text-4xl rounded-lg bg-green-500"> + </Link>
          </div>
        </div>
        <Link
          href={"/p-user/comments"}
          className="block sm:hidden w-36 self-center justify-self-center my-2 text-base p-1 rounded-lg dark:bg-gold dark:text-white bg-orange-600 text-white transition-all hover:bg-transparent active:bg-transparent hover:text-orange-600 active:text-orange-600 dark:hover:bg-transparent dark:active:bg-transparent dark:hover:text-gold dark:active:text-gold"
        >
          {" "}
          مشاهده همه ...{" "}
        </Link>
      </div>
    </>
  );
}

export default Comments;
