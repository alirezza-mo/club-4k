import ChallengeBox from "@/components/modules/ChallengeBox/ChallengeBox";
import ChallengeArticle from "@/components/templates/Profile/ChallengeArticle";
import Image from "next/image";
import React from "react";
import UserModel from "../../../../models/Users";
import { Types } from "mongoose";
import { redirect } from "next/navigation";
import moment from "jalali-moment";
import { FaCalendarAlt, FaGamepad, FaUser } from "react-icons/fa";

export default async function page({ params }) {
  const { userId } = await params;

  const userProfile = await UserModel.findOne({
    _id: { _id: new Types.ObjectId(userId) },
  });
  if (!userProfile) {
    redirect("/");
  }

  const date = userProfile.createdAt;
  const persianDate = moment(date).locale("fa").format("YYYY/MM/DD");

  return (
    <>
      <main className="min-h-screen flex flex-col gap-5 md:gap-10 items-center justify-center bg-lime-100 dark:bg-black/90 ">
        <section className="container !p-0 rounded-lg bg-white dark:bg-gray-800 flex flex-col items-center ">
          <div
            style={{
              backgroundImage: `${
                userProfile.profile
                  ? `url(${process.env.GET_LIARA}/${userProfile.profile})`
                  : `url(/images/avatar.jpg)`
              }`,
            }}
            className={`w-full h-72 rounded-lg bg-cover bg-center `}
          ></div>

          <div className=" flex md:flex-row flex-col items-center justify-between w-full gap-10  p-5 md:p-10 ">
            <div className="flex items-center gap-5">
              <Image
                src={`${
                  userProfile.avatar
                    ? `${process.env.GET_LIARA}/${userProfile.avatar}`
                    : `/images/user.jpg`
                }`}
                height={100}
                width={100}
                alt="user image"
                className="rounded-full w-28 h-28 border-4 border-orange-600 dark:border-gold "
              />
              <div className="dark:text-white text-gray-800 flex flex-col gap-4 p-4 rounded-xl bg-white dark:bg-zinc-900 shadow-md">
                <div className="flex items-center gap-2 text-orange-600 dark:text-gold text-lg font-bold">
                  <FaUser className="text-xl" />
                  <span>{userProfile.userName}</span>
                </div>

                <div className="flex items-center gap-2 text-base md:text-lg">
                  <FaCalendarAlt className="text-orange-500 dark:text-gold" />
                  <span className="text-gray-600 dark:text-gray-300">
                    تاریخ عضویت:
                  </span>
                  <span className="text-gray-800 dark:text-white font-medium">
                    {persianDate}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-base md:text-lg">
                  <FaGamepad className="text-green-600 dark:text-green-400" />
                  <span className="text-gray-600 dark:text-gray-300">
                    گیم‌نت:
                  </span>
                  <span className="text-gray-800 dark:text-white font-medium">
                    {userProfile.gameNet}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="bg-white dark:bg-zinc-800 p-5 rounded-xl shadow-lg text-center ">
                <p className="text-sm text-gray-400">تعداد بازی</p>
                <p className="text-2xl font-bold text-orange-500">36</p>
              </div>
              <div className="bg-white dark:bg-zinc-800 p-5 rounded-xl shadow-lg text-center">
                <p className="text-sm text-gray-400">برد</p>
                <p className="text-2xl font-bold text-green-500">30</p>
              </div>
              <div className="bg-white dark:bg-zinc-800 p-5 rounded-xl shadow-lg text-center">
                <p className="text-sm text-gray-400">باخت</p>
                <p className="text-2xl font-bold text-red-500">6</p>
              </div>
            </div>
            <div className="flex items-center justify-center flex-col gap-5">
              <p className="text-4xl font-extrabold text-blue-500">
                {" "}
                XP : {userProfile.xp ? userProfile.xp : 0}{" "}
              </p>
              <div className="flex justify-center mt-6">
                <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white text-lg font-bold shadow-md hover:scale-105 transition-transform">
                  🎮 به چالش کشیدن
                </button>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col items-center gap-5 p-5">
            <h3 className="text-xl font-bold text-gray-700 dark:text-white mb-2">
              👤 بیو
            </h3>
            <p className="bg-white dark:bg-zinc-800 rounded-lg p-4 border-l-4 border-orange-400 text-gray-700 dark:text-gray-200 shadow">
              {userProfile.bio || "خالی"}
            </p>
          </div>
          <div className="w-full flex flex-col gap-5 p-5">
            <h3 className="text-3xl font-black dark:text-gray-400">
              {" "}
              افتخارات :{" "}
            </h3>
            <div className=" w-full flex-wrap flex justify-center dark:text-white items-center gap-5">
              <div className="flex flex-wrap items-center gap-2 p-3 rounded-lg  dark:bg-gold dark:text-black bg-orange-600 text-white ">
                <p> 🥇 </p>
                <p> رتبه 1 در گیم نت دراگون </p>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg dark:bg-gold bg-orange-600 dark:text-black text-white">
                <p> 🥇 </p>
                <p> رتبه 1 در گلوبال </p>
              </div>
            </div>
          </div>
        </section>
        <section className="container !p-0 rounded-lg bg-white dark:bg-gray-800 flex flex-col gap-10 items-center">
          <h3 className="text-2xl font-black dark:text-gray-400 mt-10">
            {" "}
            چلنج های انجام داده :{" "}
          </h3>
          <div className="flex items-center gap-5 p-10 ">
            <select
              // onClick={(e) => setSortOrder(e.target.value)}
              className="font-vazir bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-orange-600 dark:border-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:focus:ring-yellow-400 shadow-yellow-glow transition duration-300"
              aria-label="مرتب‌سازی چلنج‌ها"
            >
              <option value="newest">جدیدترین</option>
              <option value="oldest">قدیمی‌ترین</option>
            </select>
            <select
              // onChange={(e) => setChallengeFilter(e.target.value)}
              className="font-vazir bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-orange-600 dark:border-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:focus:ring-yellow-400 shadow-yellow-glow transition duration-300"
              aria-label="فیلتر وضعیت چلنج"
            >
              <option value="all">همه</option>
              <option value="pending">فعال</option>
              <option value="completed">تمام‌شده</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-5 items-center justify-center">
            <ChallengeArticle />
            <ChallengeArticle />
            <ChallengeArticle />
          </div>
        </section>
      </main>
    </>
  );
}
