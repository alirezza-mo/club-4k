"use client";
import Image from "next/image";
import React, { useState } from "react";
import { BsBadge4kFill } from "react-icons/bs";
import { FaBars, FaMoon, FaSun } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { GoDatabase } from "react-icons/go";
import { LuTicketCheck } from "react-icons/lu";
import { AiOutlineComment } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import { CiLogout } from "react-icons/ci";
import { IoExitOutline } from "react-icons/io5";
import { LuUsers } from "react-icons/lu";
import { FaDiscourse } from "react-icons/fa6";
import { GiBattleGear } from "react-icons/gi";
import Link from "next/link";

function SideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };
  const [isDark, setIsDark] = useState();
  const toggleTheme = () => {
    const newTheme = !isDark;
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    setIsDark(newTheme);
  };

  return (
    <div className="z-50 fixed left-0 right-0 md:bottom-0 top-0 md:w-[20%] h-24 md:min-h-screen flex flex-col items-center justify-center p-2 bg-white dark:bg-black md:dark:bg-gray-800 ">
        <h1 className="hidden md:flex text-3xl font-bold text-orange-600 dark:text-gold"> گیم نت 4K </h1>
      <ul className="hidden md:flex flex-col items-center justify-center gap-5 mt-10 w-full  ">
        <Link
          href={"/p-admin/"}
          className="flex items-center justify-center gap-5 dark:text-gold dark:hover:bg-gold dark:hover:text-black text-orange-600 text-lg hover:bg-orange-600 hover:text-white rounded-lg w-full p-1 cursor-pointer transition-all text-center"
        >
          <RxDashboard />
          {" "}
          داشبورد{" "}
        </Link>
        <Link
          href={"/p-admin/users"}
          className="flex items-center justify-center gap-5 dark:text-gold dark:hover:bg-gold dark:hover:text-black text-orange-600 text-lg hover:bg-orange-600 hover:text-white rounded-lg w-full p-1 cursor-pointer transition-all text-center "
        >
          <LuUsers />
          {" "}
          کاربران{" "}
        </Link>
        <Link
          href={"/p-admin/game-courses"}
          className="flex items-center justify-center gap-5 dark:text-gold dark:hover:bg-gold dark:hover:text-black text-orange-600 text-lg hover:bg-orange-600 hover:text-white rounded-lg w-full p-1 cursor-pointer transition-all text-center "
        >
          <FaDiscourse />

          {" "}
          جلسات بازی{" "}
        </Link>
        <Link
          href={"/p-admin/tickets"}
          className="flex items-center justify-center gap-5 dark:text-gold dark:hover:bg-gold dark:hover:text-black text-orange-600 text-lg hover:bg-orange-600 hover:text-white rounded-lg w-full p-1 cursor-pointer transition-all text-center "
        >
            <LuTicketCheck />

          تیکت ها
        </Link>
        <Link
          href={"/p-admin/comments"}
          className="flex items-center justify-center gap-5 dark:text-gold dark:hover:bg-gold dark:hover:text-black text-orange-600 text-lg hover:bg-orange-600 hover:text-white rounded-lg w-full p-1 cursor-pointer transition-all text-center "
        >
            <AiOutlineComment />

          {" "}
          کامنت ها{" "}
        </Link>
        <Link
          href={"/p-admin/challenges"}
          className="flex items-center justify-center gap-5 dark:text-gold dark:hover:bg-gold dark:hover:text-black text-orange-600 text-lg hover:bg-orange-600 hover:text-white rounded-lg w-full p-1 cursor-pointer transition-all text-center "
        >
          <GiBattleGear />
          {" "}
          چلنج ها{" "}
        </Link>
        
        <button className="text-white text-lg hover:bg-red-500 bg-red-600 hover:text-white rounded-lg w-full p-1 cursor-pointer transition-all text-center justify-self-end ">
          {" "}
          خروج از حساب{" "}
        </button>
      </ul>
      <div className="md:hidden flex justify-between items-center p-5 w-full dark:bg-gold bg-orange-600 rounded-lg ">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full bg-orange-500 dark:bg-yellow-700  "
        >
          {" "}
          <FaBars className="text-lg text-white dark:text-black" />{" "}
        </button>
        <BsBadge4kFill className="text-2xl text-white dark:text-black" />
      </div>
      <div
        className={` ${
          isOpen ? "flex" : "hidden"
        } fixed p-5  right-0 top-0 bottom-0 w-52 dark:bg-black/95 bg-gray-100 h-full z-50 flex-col items-center gap-5 `}
      >
        <div className="flex items-center gap-3">
          <p className="text-lg font-bold text-orange-600 dark:text-gold">
            {" "}
            گیم نت 4K{" "}
          </p>
          <button>
            {isDark ? (
              <FaSun
                onClick={toggleTheme}
                className="text-2xl transition-all cursor-pointer dark:text-white active:text-yellow-500"
              />
            ) : (
              <FaMoon
                onClick={toggleTheme}
                className="text-2xl transition-all cursor-pointer dark:text-white active:text-yellow-500"
              />
            )}
          </button>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full dark:bg-gold dark:text-black bg-orange-400 text-white text-2xl text-center"
          >
            {" "}
            <IoExitOutline />{" "}
          </button>
        </div>
        
        <ul className="flex flex-col items-center justify-center gap-5 w-full mt-10 ">
          <Link
            href={"/p-admin"}
            className=" flex items-center justify-center gap-5 active:bg-orange-600 active:text-white dark:active:bg-gold dark:active:text-black dark:text-gold dark:hover:bg-gold dark:hover:text-black text-orange-600 text-base hover:bg-orange-600 hover:text-white rounded-lg w-full p-1 cursor-pointer transition-all text-center"
          >
            {" "}
            <RxDashboard />
          {" "}
          داشبورد{" "}
          </Link>
          <Link
            href={"/p-admin/users"}
            className="flex items-center justify-center gap-5 active:bg-orange-600 active:text-white dark:active:bg-gold dark:active:text-black dark:text-gold dark:hover:bg-gold dark:hover:text-black text-orange-600 text-base hover:bg-orange-600 hover:text-white rounded-lg w-full p-1 cursor-pointer transition-all text-center "
          >
            {" "}
            <LuUsers />
          {" "}
          کاربران{" "}
          </Link>
          <Link
            href={"/p-admin/game-courses"}
            className="flex items-center justify-center gap-5 active:bg-orange-600 active:text-white dark:active:bg-gold dark:active:text-black dark:text-gold dark:hover:bg-gold dark:hover:text-black text-orange-600 text-base hover:bg-orange-600 hover:text-white rounded-lg w-full p-1 cursor-pointer transition-all text-center "
          >
            {" "}
           <FaDiscourse />

          {" "}
          جلسات بازی{" "}
          </Link>
          <Link
            href={"/p-admin/tickets"}
            className="flex items-center justify-center gap-5 active:bg-orange-600 active:text-white dark:active:bg-gold dark:active:text-black dark:text-gold dark:hover:bg-gold dark:hover:text-black text-orange-600 text-base hover:bg-orange-600 hover:text-white rounded-lg w-full p-1 cursor-pointer transition-all text-center "
          >
             <LuTicketCheck />

          تیکت ها
          </Link>
          <Link
            href={"/p-admin/comments"}
            className="flex items-center justify-center gap-5 active:bg-orange-600 active:text-white dark:active:bg-gold dark:active:text-black dark:text-gold dark:hover:bg-gold dark:hover:text-black text-orange-600 text-base hover:bg-orange-600 hover:text-white rounded-lg w-full p-1 cursor-pointer transition-all text-center "
          >
            {" "}
            <AiOutlineComment />

          {" "}
          کامنت ها{" "}
          </Link>
          <Link href={"/p-admin/challenges"} className="flex items-center justify-center gap-5 active:bg-orange-600 active:text-white dark:active:bg-gold dark:active:text-black dark:text-gold dark:hover:bg-gold dark:hover:text-black text-orange-600 text-base hover:bg-orange-600 hover:text-white rounded-lg w-full p-1 cursor-pointer transition-all text-center ">
            {" "}
            <GiBattleGear />
          {" "}
          چلنج ها{" "}
          </Link>
          <Link href={"/p-admin/editProfile"} className="flex items-center justify-center gap-5 active:bg-orange-600 active:text-white dark:active:bg-gold dark:active:text-black dark:text-gold dark:hover:bg-gold dark:hover:text-black text-orange-600 text-base hover:bg-orange-600 hover:text-white rounded-lg w-full p-1 cursor-pointer transition-all text-center ">
            {" "}
            <CiEdit />
          {" "}
          ویرایش اطلاعات{" "}
          </Link>
          <button className="flex items-center justify-center gap-5 active:bg-red-300 active:text-white text-white text-lg hover:bg-red-300 hover:text-white bg-red-600 rounded-lg w-full p-1 cursor-pointer transition-all text-center justify-self-end ">
            {" "}
            <CiLogout />
            خروج از حساب{" "}
          </button>
        </ul>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 backdrop-blur-2xl md:hidden z-40"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
}

export default SideBar;
