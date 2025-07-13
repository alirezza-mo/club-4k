"use client";
import { CiSearch } from "react-icons/ci";
import { FaMoon, FaSun } from "react-icons/fa";
import { IoIosMore } from "react-icons/io";
import { TbBadge4KFilled } from "react-icons/tb";
import { CiHome } from "react-icons/ci";
import { GiChampions } from "react-icons/gi";
import { MdRoundaboutLeft } from "react-icons/md";
import { IoIosContact } from "react-icons/io";
import { RxExit } from "react-icons/rx";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";

function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const { user, loading } = useUser();

  loading && null;

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

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

  const [isOpen, setIsOpen] = useState(false);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <nav className="absolute z-50 w-full flex justify-center">
        <div className=" fixed w-full mx-5 xl:w-[1240px] lg:w-[900px] md:w-[700px] bg-transparent md:flex items-center justify-between mt-5 backdrop-blur-xl p-2 rounded-2xl">
          <div className="hidden md:block">
            <ul className="flex items-center justify-center gap-5 text-gray-500 dark:text-white ">
              <Link
                href={"/"}
                className="transition-all cursor-pointer hover:text-gray-400"
              >
                {" "}
                خانه{" "}
              </Link>
              <Link
                href={"/ranking"}
                className="transition-all cursor-pointer hover:text-gray-400"
              >
                {" "}
                نفرات برتر{" "}
              </Link>
              <Link
                href={"/about-us"}
                className="transition-all cursor-pointer hover:text-gray-400"
              >
                {" "}
                درباره ما{" "}
              </Link>
              <Link
                href={"/contact-us"}
                className="transition-all cursor-pointer hover:text-gray-400"
              >
                {" "}
                ارتباط با ما{" "}
              </Link>
            </ul>
          </div>
          <div className=" items-center justify-center gap-5 hidden md:flex">
            {user ? (
              <Link
                href={"/p-user"}
                className="px-2 py-2 dark:bg-gold bg-orange-600  text-gray-100 transition-all cursor-pointer dark:hover:bg-amber-300 hover:bg-red-600 hover:text-white rounded-lg "
              >
                {user.userName}
              </Link>
            ) : (
              <Link
                href={"/register"}
                className="px-2 py-2 dark:bg-gold bg-orange-600  text-gray-100 transition-all cursor-pointer dark:hover:bg-amber-300 hover:bg-red-600 hover:text-white rounded-lg "
              >
                {" "}
                ثبت نام | عضویت{" "}
              </Link>
            )}
            <div className="flex items-center justify-center gap-2 text-black dark:text-white ">
              <span>
                <CiSearch className="text-3xl transition-all cursor-pointer hover:text-gray-600" />
              </span>
              <span>
                {isDark ? (
                  <FaSun
                    onClick={toggleTheme}
                    className="text-3xl transition-all cursor-pointer dark:text-white active:text-yellow-500"
                  />
                ) : (
                  <FaMoon
                    onClick={toggleTheme}
                    className="text-3xl transition-all cursor-pointer dark:text-white active:text-yellow-500"
                  />
                )}
              </span>
            </div>
          </div>
          <div className="md:hidden flex items-center justify-between text-white text-4xl px-2">
            <IoIosMore onClick={toggleNav} />
            <h3 className="text-2xl"> گیم نت 4K </h3>
            <Link href={"/"}>
              <TbBadge4KFilled />
            </Link>
          </div>
        </div>
        <div
          className={` ${
            isOpen ? "flex" : "hidden"
          } fixed p-5  right-0 top-0 bottom-0 w-52 dark:bg-black/95 bg-gray-100 h-full z-50 flex-col justify-between items-center `}
        >
          <div className="flex items-center justify-between w-full">
            <h3 className="text-orange-600 dark:text-gold text-xl font-extrabold ">
              {" "}
              گیم نت 4K{" "}
            </h3>
            <span>
              <RxExit
                className="text-2xl text-orange-600 dark:text-gold"
                onClick={toggleNav}
              />
            </span>
          </div>
          <div className="self-start justify-self-start">
            <ul className="flex flex-col gap-5 dark:text-gold ">
              <Link
                href={"/"}
                className="flex items-center gap-5 justify-start transition-all p-1 hover:bg-orange-600 hover:text-white rounded-lg cursor-pointer active:bg-orange-600 active:text-white dark:hover:bg-gold dark:hover:text-black dark:active:bg-gold dark:active:text-black "
              >
                <CiHome />
                خانه
              </Link>
              <Link
                href={"/ranking"}
                className="flex items-center gap-5 justify-start transition-all p-1 hover:bg-orange-600 hover:text-white rounded-lg cursor-pointer active:bg-orange-600 active:text-white dark:hover:bg-gold dark:hover:text-black dark:active:bg-gold dark:active:text-black "
              >
                <GiChampions />
                نفرات برتر
              </Link>
              <Link
                href={"/about-us"}
                className="flex items-center gap-5 justify-start transition-all p-1 hover:bg-orange-600 hover:text-white rounded-lg cursor-pointer active:bg-orange-600 active:text-white dark:hover:bg-gold dark:hover:text-black dark:active:bg-gold dark:active:text-black "
              >
                <MdRoundaboutLeft />
                درباره ما
              </Link>
              <Link
                href={"/contact-us"}
                className="flex items-center gap-5 justify-start transition-all p-1 hover:bg-orange-600 hover:text-white rounded-lg cursor-pointer active:bg-orange-600 active:text-white dark:hover:bg-gold dark:hover:text-black dark:active:bg-gold dark:active:text-black "
              >
                <IoIosContact />
                ارتباط با ما
              </Link>
            </ul>
          </div>
          <div className="flex items-center gap-5">
            {/* {user ? (
              <Link
                href={"/p-user"}
                className="border dark:text-white dark:border-gold border-orange-600 p-1 rounded-lg cursor-pointer transition-all  active:bg-orange-700 active:text-white dark:active:bg-gold dark:active:text-black "
              >
                {user.userName}
              </Link>
            ) : (
              <Link
                href={"/register"}
                className="border dark:text-white dark:border-gold border-orange-600 p-1 rounded-lg cursor-pointer transition-all  active:bg-orange-700 active:text-white dark:active:bg-gold dark:active:text-black "
              >
                {" "}
                ورود | عضویت{" "}
              </Link>
            )} */}
            <span>
              {isDark ? (
                <FaSun
                  onClick={toggleTheme}
                  className="text-3xl transition-all cursor-pointer dark:text-white active:text-yellow-500"
                />
              ) : (
                <FaMoon
                  onClick={toggleTheme}
                  className="text-3xl transition-all cursor-pointer dark:text-white active:text-yellow-500"
                />
              )}
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
