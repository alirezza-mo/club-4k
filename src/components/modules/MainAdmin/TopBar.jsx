"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  FaSun,
  FaMoon,
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
  FaCog,
} from "react-icons/fa";
import Image from "next/image";

export default function Topbar() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // نمونه داده‌های اعلان‌ها
  const notifications = [
    {
      id: 1,
      message: "چلنج جدید توسط گیمر نینجا ایجاد شد",
      time: "۱۴۰۴/۰۳/۲۰",
    },
    { id: 2, message: "تیکت #۱۲۳۴ نیاز به پاسخ دارد", time: "۱۴۰۴/۰۳/۱۹" },
  ];

  // سوئیچ تم
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return newMode;
    });
  };

  // خروج
  const handleLogout = () => {
    toast.success("با موفقیت خارج شدی!");
    router.push("/login");
  };

  return (
    <header className="hidden md:flex fixed top-0 left-0 w-[80%] bg-white dark:bg-gray-800 shadow-yellow-glow z-50">
      <div className="w-full mx-auto px-4 py-3 flex justify-around items-center">
        {/* لوگو */}
        <h2 className=" text-2xl font-bold text-orange-600 dark:text-gold ">
          مدیرت ⚒️
        </h2>
        {/* نوبار راست */}
        <div className="flex items-center gap-4">
          {/* سوئیچ تم */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-orange-600 dark:hover:bg-yellow-400 hover:text-white dark:hover:text-gray-900 transition duration-300"
            aria-label="تغییر تم"
          >
            {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>

          {/* اعلان‌ها */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen((prev) => !prev)}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-orange-600 dark:hover:bg-yellow-400 hover:text-white dark:hover:text-gray-900 transition duration-300"
              aria-label="مشاهده اعلان‌ها"
            >
              <FaBell size={20} />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>
            {isNotificationsOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-yellow-glow border border-orange-600 dark:border-yellow-400 overflow-hidden">
                <div className="font-vazir p-4">
                  <h3 className="text-gray-700 dark:text-gray-200 text-lg font-bold">
                    اعلان‌ها
                  </h3>
                  {notifications.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                      اعلانی وجود ندارد
                    </p>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="py-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
                      >
                        <p className="text-gray-700 dark:text-gray-200 text-sm">
                          {notification.message}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                          {notification.time}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* پروفایل */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-yellow-400"
              aria-label="منوی پروفایل"
            >
              <Image
                src={"/images/user.jpg"}
                height={32}
                width={32}
                alt="admin picture"
                className="w-8 h-8 rounded-full border-2 border-orange-600 dark:border-yellow-400"
              />
              <span className="font-vazir hidden lg:block">ادمین</span>
            </button>
            {isProfileOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-yellow-glow border border-orange-600 dark:border-yellow-400 overflow-hidden">
                <div className="font-vazir p-2">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      router.push("/main-admin/editProfile");
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FaCog /> ویرایش پروفایل
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FaSignOutAlt /> خروج
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
