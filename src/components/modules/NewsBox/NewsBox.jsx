import Image from "next/image";
import React from "react";

function NewsBox() {
  return (
    <>
      <div className="cursor-pointer dark:active:bg-yellow-200 active:bg-orange-300 sm:flex md:w-[300px] md:h-[200px] lg:w-[400px] lg:h-[200px] xl:w-[550px] xl:h-[240px] rounded-3xl dark:bg-gray-900 bg-white  transition-all dark:hover:bg-yellow-200 hover:bg-orange-300 ">
        <div className="flex justify-center items-center p-2">
          <Image
            src={"/images/news.png"}
            width={280}
            height={240}
            alt="#blog"
            className="rounded-2xl md:h-44 mx-auto lg:h-[220px] "
          />
        </div>
        <div className="flex flex-col gap-1 p-1  md:gap-5 md:p-2 xl:gap-5 xl:p-7 lg:gap-3 lg:p-5">
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
          <p className="text-center text-xs lg:text-lg text-black dark:text-gray-400 ">
            {" "}
            رکورد بیشترین باخت متوالی توسط علی ملتفت{" "}
          </p>
          <button className="sm:block hidden bg-gray-300 rounded-xl text-sm dark:bg-gray-700 dark:text-white px-5 py-2 cursor-pointer">
            {" "}
            مشاهده مقاله{" "}
          </button>
        </div>
      </div>
    </>
  );
}

export default NewsBox;
