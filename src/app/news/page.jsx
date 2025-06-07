import Footer from "@/components/modules/Footer/Footer";
import Navbar from "@/components/modules/Navbar/Navbar";
import React from "react";

import RankFilterSelect from "@/components/templates/ranking/RankFilter";
import SelectDropdown from "@/components/templates/ranking/SelectDropDown";
import NewsSection from "@/components/templates/news/NewsSection";

function page() {
  const options = [
    { label: "همه گیم نت ها", value: "all" },
    { label: "4K", value: "4k" },
    { label: "dragon club", value: "dragon" },
    { label: " gameLand ", value: "gameLand" },
  ];

  const optionsFilter = [
    { id: 1, label: "جدیدترین اخبار" },
    { id: 2, label: "پر بازدیدترین اخبار" },
  ];

  return (
    <>
      <main className="relative  min-h-screen flex flex-col justify-between bg-lime-100 dark:bg-black/90">
        <Navbar />
        <div className="container">
          <div className=" flex flex-col mb:flex-row items-center mb:items-start justify-center ">
            <div className="w-[50%] mt-24 mb:mt-32 flex flex-col items-center mb:items-start gap-5 ">
              <h3 className="text-lg font-bold text-white "> اخبار </h3>
              <div>
                <RankFilterSelect
                  title={" نمایش بر اساس "}
                  optionsFilter={optionsFilter}
                />
              </div>
              <div className=" flex flex-wrap w-full ">
                <NewsSection />
                <NewsSection />
                <NewsSection />
                <NewsSection />
                <NewsSection />
                <NewsSection />
                <NewsSection />
                <NewsSection />
                <NewsSection />
                <NewsSection />
              </div>
              <button className="self-center mb-28 cursor-pointer transition-all hover:scale-105 active:scale-105 p-2 rounded-lg text-center bg-orange-600 text-white dark:bg-gold ">
                {" "}
                ادامه ...{" "}
              </button>
            </div>
            <div className="w-[50%] mt-1 mb:mt-32 flex flex-col items-center mb:items-start gap-5 ">
              <h3 className="text-lg font-bold text-white "> اخبار گیم نت</h3>
              <div>
                <SelectDropdown
                  title={"جستجو اخبار سایر گیم نت ها"}
                  options={options}
                />
              </div>
              <div className=" flex flex-wrap w-full ">
                <NewsSection />
                <NewsSection />
                <NewsSection />
                <NewsSection />
                <NewsSection />
                <NewsSection />
                <NewsSection />
                <NewsSection />
                <NewsSection />
                <NewsSection />
              </div>
              <button className="self-center mb-28 cursor-pointer transition-all hover:scale-105 active:scale-105 p-2 rounded-lg text-center bg-orange-600 text-white dark:bg-gold ">
                {" "}
                ادامه ...{" "}
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}

export default page;
