import Image from "next/image";
import React from "react";

function NewsBox() {
  return (
    <>
      {/* <div className="cursor-pointer dark:active:bg-yellow-200 active:bg-orange-300 flex flex-col items-center justify-center w-[300px] h-[200px]  rounded-3xl dark:bg-gray-900 bg-white  transition-all dark:hover:bg-yellow-200 hover:bg-orange-300 "> */}
      <div className="w-[200px] cursor-pointer dark:active:bg-yellow-200 active:bg-orange-300 dark:bg-gray-900 rounded-3xl bg-white  transition-all dark:hover:bg-yellow-200 hover:bg-orange-300 ">
        <div className="flex justify-center items-center p-1">
          <Image
            src={"/images/news.png"}
            width={170}
            height={190}
            alt="#blog"
            className="rounded-3xl mx-auto"
          />
        </div>
        <div className="flex flex-col gap-1 p-3 ">
          <div className="flex items-center justify-center  gap-2">
            <span className="text-xs text-indigo-500 bg-indigo-700/10 backdrop-blur-md px-2 sm:px-5 py-1 rounded-xl ">
              {" "}
              اخبار{" "}
            </span>
            <span className="text-xs  text-indigo-500 bg-indigo-600/10 backdrop-blur-md px-2 sm:px-5 py-1 rounded-xl ">
              {" "}
              رقابت{" "}
            </span>
          </div>
          <p className="w-full h-24 text-center text-base text-black dark:text-gray-400 truncate text-wrap  ">
            {" "}
            رکورد بیشترین باخت متوالی توسط علی ملتفت{" "}
          </p>
          <button className="sm:block hidden bg-gray-300 rounded-xl text-sm dark:bg-gray-700 dark:text-white px-5 py-2 cursor-pointer">
            {" "}
            مشاهده خبر{" "}
          </button>
        </div>
      </div>
    </>
  );
}

export default NewsBox;
