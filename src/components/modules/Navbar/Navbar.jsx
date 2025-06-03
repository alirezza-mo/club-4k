"use client"
import { CiSearch } from "react-icons/ci";
import { FaMoon } from "react-icons/fa";
import { IoIosMore } from "react-icons/io";
import { TbBadge4KFilled } from "react-icons/tb";
import { CiHome } from "react-icons/ci";
import { GiChampions } from "react-icons/gi";
import { MdRoundaboutLeft } from "react-icons/md";
import { IoIosContact } from "react-icons/io";
import { RxExit } from "react-icons/rx";
import { useState } from "react";
import Link from "next/link";

function Navbar() {
  const [isOpen , setIsOpen] = useState(false)

  const toggleNav = () => {
    setIsOpen(!isOpen)
  }
  return (
    <>
      <nav className="z-50 w-full flex justify-center">
        <div className=" fixed w-full mx-5 xl:w-[1240px] lg:w-[900px] md:w-[700px] bg-transparent md:flex items-center justify-between mt-5 backdrop-blur-xl p-2 rounded-2xl ">
          <div className="hidden md:block">
            <ul className="flex items-center justify-center gap-5 text-white">
              <li className="transition-all cursor-pointer hover:text-gray-400">
                {" "}
                خانه{" "}
              </li>
              <li className="transition-all cursor-pointer hover:text-gray-400">
                {" "}
                نفرات برتر{" "}
              </li>
              <li className="transition-all cursor-pointer hover:text-gray-400">
                {" "}
                درباره ما{" "}
              </li>
              <li className="transition-all cursor-pointer hover:text-gray-400">
                {" "}
                ارتباط با ما{" "}
              </li>
            </ul>
          </div>
          <div className=" items-center justify-center gap-5 hidden md:flex">
            <button className="px-2 py-2 bg-orange-600 text-gray-100 transition-all cursor-pointer hover:bg-red-600 hover:text-white rounded-lg ">
              {" "}
              ثبت نام | عضویت{" "}
            </button>
            <div className="flex items-center justify-center gap-2 text-black">
              <span>
                <CiSearch className="text-3xl transition-all cursor-pointer hover:text-gray-600" />
              </span>
              <span>
                <FaMoon className="text-3xl transition-all cursor-pointer hover:text-yellow-500" />
              </span>
            </div>
          </div>
          <div className="md:hidden flex items-center justify-between text-white text-4xl px-2">
            <IoIosMore onClick={toggleNav} />
            <h3 className="text-3xl"> گیم نت 4K </h3>
            <Link href={"/"}>
            <TbBadge4KFilled />
            </Link>
          </div>
        </div>
        <div className={` ${isOpen ? "flex" : "hidden" } fixed p-5  right-0 top-0 bottom-0 w-52 bg-gray-100 h-full z-50 flex-col justify-between items-center `}>
          <div className="flex items-center justify-between w-full">
            <h3 className="text-orange-600 text-xl font-extrabold "> گیم نت 4K </h3>
            <span>
              <RxExit className="text-2xl text-orange-600" onClick={toggleNav} />
            </span>
          </div>
          <div className="self-start justify-self-start">
            <ul className="flex flex-col gap-5" >
              <li className="flex items-center gap-5 justify-start transition-all p-1 hover:bg-orange-600 hover:text-white rounded-lg cursor-pointer active:bg-orange-600 active:text-white ">
                <CiHome />
                خانه
              </li>
              <li className="flex items-center gap-5 justify-start transition-all p-1 hover:bg-orange-600 hover:text-white rounded-lg cursor-pointer active:bg-orange-600 active:text-white ">
                <GiChampions />
                نفرات برتر
              </li>
              <li className="flex items-center gap-5 justify-start transition-all p-1 hover:bg-orange-600 hover:text-white rounded-lg cursor-pointer active:bg-orange-600 active:text-white ">
                <MdRoundaboutLeft />
                درباره ما
              </li>
              <li className="flex items-center gap-5 justify-start transition-all p-1 hover:bg-orange-600 hover:text-white rounded-lg cursor-pointer active:bg-orange-600 active:text-white ">
                <IoIosContact />
                ارتباط با ما
              </li>
            </ul>
          </div>
          <div className="flex items-center gap-5">
            <button className="border border-orange-600 p-1 rounded-lg cursor-pointer transition-all active:bg-orange-700 active:text-white "> ورود | عضویت </button>
            <span>
              {" "}
              <FaMoon className="text-3xl transition-all cursor-pointer active:text-yellow-500" />{" "}
            </span>
          </div>
        </div>
        {isOpen && (
        <div
          className="fixed inset-0 backdrop-blur-2xl md:hidden z-40"
          onClick={toggleNav}
        ></div>
      )}
      </nav>
    </>
  );
}

export default Navbar;
