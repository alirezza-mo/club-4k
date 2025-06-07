import Footer from "@/components/modules/Footer/Footer";
import Navbar from "@/components/modules/Navbar/Navbar";
import React from "react";
import LeaderboardCard from "@/components/templates/ranking/RankBox";
import RankFilterSelect from "@/components/templates/ranking/RankFilter";
import SelectDropdown from "@/components/templates/ranking/SelectDropDown";
import GalleryImages from "@/components/templates/gallery/GalleryImages";

function page() {
  const options = [
    { label: "همه گیم نت ها", value: "all" },
    { label: "4K", value: "4k" },
    { label: "dragon club", value: "dragon" },
    { label: " gameLand ", value: "gameLand" },
  ];

  const optionsFilter = [
    { id: 1, label: "جدیدترین تصاویر" },
    { id: 2, label: "قدیمی ترین تصاویر" },
  ];

  return (
    <>
      <main className="flex flex-col justify-between bg-lime-100 dark:bg-black/90">
        <Navbar />
        <div className="container flex flex-col gap-10 items-center justify-center  ">
          <div className="flex lg:flex-row flex-col items-start">
            <div className="flex flex-col gap-10 w-96 mt-52  lg:mt-32 ">
              <SelectDropdown title={"جستجو تصاویر گیم نت ها"} options={options} />
              <RankFilterSelect title={"چینش بر اساس"} optionsFilter={optionsFilter}  />
            </div>
            <div className="flex flex-wrap gap-10 items-center justify-center mt-36 w-full  ">
              <GalleryImages />
            </div>
          </div>
          <button className=" mb-28 cursor-pointer transition-all hover:scale-105 active:scale-105 p-2 rounded-lg text-center bg-orange-600 text-white dark:bg-gold ">
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
