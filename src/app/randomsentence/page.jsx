import Footer from "@/components/modules/Footer/Footer";
import MotivationBox from "@/components/modules/MotivationBox/MotivationBox";
import Navbar from "@/components/modules/Navbar/Navbar";
import React from "react";

function page() {
  return (
    <>
      <main className="bg-lime-100 dark:bg-black/90 flex flex-col justify-between ">
        <Navbar />
        <div className="container flex flex-col items-center justify-center gap-10">
          <div className="mt-36">
            <form className=" p-2 lg:p-10 rounded-lg dark:bg-gray-900 bg-white flex flex-col items-center gap-2">
              <h3 className="text-lg pb-2 dark:text-white text-gray-600 border-b dark:border-gold border-orange-600 ">
                {" "}
                به یک جمله پرانرژی مارو دعوت کن :){" "}
              </h3>
              <div className="flex flex-col lg:flex-row items-center gap-2">
                <label htmlFor="userName" className="dark:text-white">
                  {" "}
                  نام کاربری{" "}
                </label>
                <input
                  type="text"
                  name="userName"
                  id="userName"
                  placeholder="اختیاری ..."
                  className="p-1 rounded-lg bg-orange-300 dark:bg-gold outline-none dark:focus:ring-amber-500 focus:ring ring-orange-700 dark:text-gray-200"
                />
              </div>
              <div className="flex items-center gap-2 flex-col lg:flex-row">
                <label htmlFor="sentence" className="dark:text-white">
                  {" "}
                  جملت رو بنویس{" "}
                </label>
                <textarea name="sentence" id="sentence" className="p-1 w-72 h-52 text-wrap rounded-lg bg-orange-300 dark:bg-gold outline-none dark:focus:ring-amber-500 focus:ring ring-orange-700 dark:text-gray-200"></textarea>
              </div>
              <div>
                <input type="submit" value="ارسال ..." className="p-2 text-white rounded-lg text-center bg-orange-600 dark:bg-gold transition-all hover:bg-transparent hover:text-orange-600 dark:hover:bg-transparent dark:hover:text-gold cursor-pointer" />
              </div>
            </form>
          </div>
          <div className="w-[70%] flex flex-wrap items-start gap-5 justify-center">
            <MotivationBox />
            <MotivationBox />
            <MotivationBox />
            <MotivationBox />
            <MotivationBox />
            <MotivationBox />
            <MotivationBox />
            <MotivationBox />
            <MotivationBox />
            <MotivationBox />
          </div>
          <button className=" cursor-pointer transition-all hover:scale-105 active:scale-105 p-2 rounded-lg text-center bg-orange-600 text-white dark:bg-gold ">
            {" "}
            ادامه ...{" "}
          </button>
        </div>

        <Footer />
      </main>
    </>
  );
}

export default page;


