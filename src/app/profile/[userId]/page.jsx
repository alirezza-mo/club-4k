import ChallengeBox from "@/components/modules/ChallengeBox/ChallengeBox";
import ChallengeArticle from "@/components/templates/Profile/ChallengeArticle";
import Image from "next/image";
import React from "react";
import UserModel from "../../../../models/Users";
import { Types } from "mongoose";
import { redirect } from "next/navigation";
import moment from "jalali-moment";

export default async function page({ params }) {
  const  {userId}  = await params

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
              backgroundImage:`${userProfile.profile ? `url(${process.env.GET_LIARA}/${userProfile.profile})` : `url(/images/avatar.jpg)` }`
            }}
            className={`w-full h-56 rounded-lg bg-cover bg-center `}
          ></div>
         
          <div className=" flex md:flex-row flex-col items-center justify-between w-full gap-10  p-5 md:p-10 ">
            <div className="flex items-center gap-5">
              <Image
                src={`${userProfile.avatar ? `${process.env.GET_LIARA}/${userProfile.avatar}` : `/images/user.jpg`}`}
                height={100}
                width={100}
                alt="user image"
                className="rounded-full w-28 h-28 border-4 border-orange-600 dark:border-gold "
              />
              <div className="dark:text-white text-gray-700 flex flex-col gap-2">
                <p className="text-base md:text-xl dark:text-gold text-orange-600 font-bold">
                  {" "}
                  {userProfile.userName}{" "}
                </p>
                <div className="text-base md:text-xl flex items-center gap-2">
                  <p> تاریخ عضویت : </p>
                  <p> {persianDate} </p>
                </div>
                <p className="text-base md:text-xl">
                  {" "}
                  گیم نت : {userProfile.gameNet}{" "}
                </p>
              </div>
            </div>
            <div className="flex  items-center gap-7 text-gray-400">
              <div className="flex flex-col items-center justify-center gap-1">
                <p> تعداد بازی </p>
                <p> 36 </p>
              </div>
              <div className="flex flex-col items-center justify-center gap-1">
                <p> برد </p>
                <p> 30 </p>
              </div>
              <div className="flex flex-col items-center justify-center gap-1">
                <p> باخت </p>
                <p> 6 </p>
              </div>
            </div>
            <div className="flex items-center justify-center flex-col gap-5">
              <p className="text-4xl font-extrabold text-blue-500">
                {" "}
                XP : {userProfile.xp ? userProfile.xp : 0}{" "}
              </p>
              <button className="p-2 rounded-lg text-white bg-red-600 cursor-pointer ">
                {" "}
                به چالش کشیدن{" "}
              </button>
            </div>
          </div>
          <div className="w-full flex flex-col items-center gap-5 p-5">
            <h3 className="text-3xl font-black dark:text-gray-400"> بیو </h3>
            <p className="dark:text-white text-black">
              {" "}
              {userProfile.bio ? userProfile.bio : "خالی"}{" "}
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


