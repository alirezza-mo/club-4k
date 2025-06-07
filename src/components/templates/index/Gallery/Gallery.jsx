import GalleryBox from "@/components/modules/GalleryBox/GalleryBox";
import Link from "next/link";
import React from "react";

function Gallery() {
  return (
    <>
      <section className="mt-20 w-full ">
        <div className="w-full flex justify-between items-center text-xl sm:text-2xl">
          <h3 className="dark:text-white font-bold flex items-center gap-2 border-b-4 dark:border-gold dark:hover:border-none border-orange-600 pb-2 hover:border-none ">
            {" "}
            گالری تصاویر گیم نت 4K
          </h3>
          <Link
            href={"/gallery"}
            className=" text-lg p-2 rounded-lg dark:bg-gold dark:text-white bg-orange-600 text-white transition-all hover:bg-transparent active:bg-transparent hover:text-orange-600 active:text-orange-600 dark:hover:bg-transparent dark:active:bg-transparent dark:hover:text-gold dark:active:text-gold"
          >
            {" "}
            مشاهده همه ...{" "}
          </Link>
        </div>
        <div className="mt-14 w-full rounded-lg flex items-center justify-center gap-2 flex-wrap ">
          <GalleryBox />
          <GalleryBox />
          <GalleryBox />
        </div>
      </section>
    </>
  );
}

export default Gallery;
