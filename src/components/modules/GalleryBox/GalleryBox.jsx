import React from "react";

function GalleryBox() {
  return (
    <>
      <div className="group cursor-pointer relative bg-[url('/images/header2.jpg')] w-40 h-[250px] md:w-96 md:h-[570px] bg-cover bg-center rounded-3xl flex flex-col items-center justify-end hover:justify-center gap-5 p-10 transition-all">
        <div className="absolute inset-0 h-full w-full opacity-0 bg-black/50 group-hover:opacity-100 rounded-3xl transition-all "></div>
      </div>
    </>
  );
}

export default GalleryBox;
