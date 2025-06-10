"use client";
import React, { useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

function TopBar() {
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
    <>
      <div className="md:flex h-20 px-5 hidden items-center justify-between bg-white dark:bg-gray-800 ">
        <h3 className="text-lg dark:text-white">
          {" "}
          4K | هخامنش به پنل کاربری خود خوش آمدید 🧡💛{" "}
        </h3>
        <button>
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
        </button>
      </div>
    </>
  );
}

export default TopBar;
