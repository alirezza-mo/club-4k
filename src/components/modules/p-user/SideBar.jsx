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
import Link from "next/link";
import swal from "sweetalert";
import { redirect } from "next/navigation";

function SideBar({ userName, gameNet }) {
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

  const handleLogout = () => {
    swal({
      title: "آیا مطمئنی؟",
      text: "با این کار از حساب کاربری خارج می‌شوی",
      icon: "warning",
      buttons: ["لغو", "خروج"],
      dangerMode: true,
    }).then((willLogout) => {
      if (willLogout) {
        fetch("/api/auth/signOut", {
          method: "POST",
          credentials: "include",
        })
          .then((res) => {
            if (res.ok) {
              swal("با موفقیت از حساب خارج شدید!", {
                icon: "success",
              }).then(() => {
                redirect("/");
              });
            } else {
              swal("خطایی رخ داد! دوباره تلاش کنید.", {
                icon: "error",
              });
            }
          })
          .catch(() => {
            swal("در ارتباط با سرور مشکلی پیش آمده!", {
              icon: "error",
            });
          });
      }
    });
  };

  return (
    <div className="z-50 fixed left-0 right-0 md:bottom-0 top-0 md:w-[20%] h-24 md:min-h-screen flex flex-col items-center p-2 bg-white dark:bg-black md:dark:bg-gray-800 ">
      <div className="w-full md:flex hidden flex-col justify-between items-center gap-2 p-2 bg-orange-500 dark:bg-gold rounded-lg ">
        <p className="text-lg font-bold text-white ">
          {" "}
          {userName} - {gameNet}{" "}
        </p>
        <Image
          src={"/images/user.jpg"}
          height={50}
          width={50}
          alt="user image"
          className="rounded-full w-28 h-28"
        />
      </div>
      <ul className="hidden md:flex flex-col items-center justify-center gap-5 mt-10 w-full  ">
        <Link
          href={"/p-user/"}
          className="dark:text-gold dark:hover:bg-gold dark:hover:text-black text-orange-600 text-lg hover:bg-orange-600 hover:text-white rounded-lg w-full p-1 cursor-pointer transition-all text-center"
        >
          {" "}
          پنل کاربری{" "}
        </Link>
        <Link
          href={"/p-user/my-statistics"}
          className="dark:text-gold dark:hover:bg-gold dark:hover:text-black text-orange-600 text-lg hover:bg-orange-600 hover:text-white rounded-lg w-full p-1 cursor-pointer transition-all text-center "
        >
          {" "}
          آمار من{" "}
        </Link>
        <Link
          href={"/p-user/tickets"}
          className="dark:text-gold dark:hover:bg-gold dark:hover:text-black text-orange-600 text-lg hover:bg-orange-600 hover:text-white rounded-lg w-full p-1 cursor-pointer transition-all text-center "
        >
          {" "}
          تیکت ها{" "}
        </Link>
        <Link
          href={"/p-user/challenge"}
          className="dark:text-gold dark:hover:bg-gold dark:hover:text-black text-orange-600 text-lg hover:bg-orange-600 hover:text-white rounded-lg w-full p-1 cursor-pointer transition-all text-center "
        >
          رقابت ها (چلنج)
        </Link>
        <Link
          href={"/p-user/comments"}
          className="dark:text-gold dark:hover:bg-gold dark:hover:text-black text-orange-600 text-lg hover:bg-orange-600 hover:text-white rounded-lg w-full p-1 cursor-pointer transition-all text-center "
        >
          {" "}
          کامنت ها{" "}
        </Link>
        <Link
          href={"/p-user/editprofile"}
          className="dark:text-gold dark:hover:bg-gold dark:hover:text-black text-orange-600 text-lg hover:bg-orange-600 hover:text-white rounded-lg w-full p-1 cursor-pointer transition-all text-center "
        >
          {" "}
          ویرایش اطلاعات{" "}
        </Link>
        <button
          onClick={handleLogout}
          className="text-white text-lg hover:bg-red-500 bg-red-600 hover:text-white rounded-lg w-full p-1 cursor-pointer transition-all text-center justify-self-end "
        >
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
        <div className="rounded-lg py-7 text-white font-bold dark:bg-gold dark:text-black bg-orange-600 w-full text-center">
          <h3>
            {" "}
            {userName}-{gameNet}{" "}
          </h3>
        </div>
        <ul className="flex flex-col items-center justify-center gap-5 w-full mt-10 ">
          <Link
            href={"/p-user"}
            className=" flex items-center justify-center gap-5 active:bg-orange-600 active:text-white dark:active:bg-gold dark:active:text-black dark:text-gold dark:hover:bg-gold dark:hover:text-black text-orange-600 text-base hover:bg-orange-600 hover:text-white rounded-lg w-full p-1 cursor-pointer transition-all text-center"
          >
            {" "}
            <RxDashboard />
            پنل کاربری{" "}
          </Link>
          <Link
            href={"/p-user/my-statistics"}
            className="flex items-center justify-center gap-5 active:bg-orange-600 active:text-white dark:active:bg-gold dark:active:text-black dark:text-gold dark:hover:bg-gold dark:hover:text-black text-orange-600 text-base hover:bg-orange-600 hover:text-white rounded-lg w-full p-1 cursor-pointer transition-all text-center "
          >
            {" "}
            <GoDatabase />
            آمار من{" "}
          </Link>
          <Link
            href={"/p-user/tickets"}
            className="flex items-center justify-center gap-5 active:bg-orange-600 active:text-white dark:active:bg-gold dark:active:text-black dark:text-gold dark:hover:bg-gold dark:hover:text-black text-orange-600 text-base hover:bg-orange-600 hover:text-white rounded-lg w-full p-1 cursor-pointer transition-all text-center "
          >
            {" "}
            <LuTicketCheck />
            تیکت ها{" "}
          </Link>
          <Link
            href={"/p-user/challenge"}
            className="flex items-center justify-center gap-5 active:bg-orange-600 active:text-white dark:active:bg-gold dark:active:text-black dark:text-gold dark:hover:bg-gold dark:hover:text-black text-orange-600 text-base hover:bg-orange-600 hover:text-white rounded-lg w-full p-1 cursor-pointer transition-all text-center "
          >
            رقابت ها (چلنج)
          </Link>
          <Link
            href={"/p-user/comments"}
            className="flex items-center justify-center gap-5 active:bg-orange-600 active:text-white dark:active:bg-gold dark:active:text-black dark:text-gold dark:hover:bg-gold dark:hover:text-black text-orange-600 text-base hover:bg-orange-600 hover:text-white rounded-lg w-full p-1 cursor-pointer transition-all text-center "
          >
            {" "}
            <AiOutlineComment />
            کامنت ها{" "}
          </Link>
          <Link
            href={"/p-user/editprofile"}
            className="flex items-center justify-center gap-5 active:bg-orange-600 active:text-white dark:active:bg-gold dark:active:text-black dark:text-gold dark:hover:bg-gold dark:hover:text-black text-orange-600 text-base hover:bg-orange-600 hover:text-white rounded-lg w-full p-1 cursor-pointer transition-all text-center "
          >
            {" "}
            <CiEdit />
            ویرایش اطلاعات{" "}
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-5 active:bg-red-300 active:text-white text-white text-lg hover:bg-red-300 hover:text-white bg-red-600 rounded-lg w-full p-1 cursor-pointer transition-all text-center justify-self-end "
          >
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
