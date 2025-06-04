"use client";
import Link from "next/link";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function page() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <main className="flex items-center justify-center  w-full h-screen bg-lime-200">
        <section className="sm:w-96 sm:h-96 w-80 h-80 bg-white rounded-xl flex flex-col items-start gap-3 sm:gap-10 p-3 ">
          <h1 className="text-orange-600 text-2xl font-bold">
            {" "}
            ورود به 4K کلاب{" "}
          </h1>
          <form className="w-full space-y-4">
            <div className="">
              <label htmlFor="phone" className="block text-gray-600 mb-1">
                {" "}
                شماره تلفن :{" "}
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                // value={formData.phone}
                // onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-200  text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-300"
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="block text-gray-600 mb-1">
                {" "}
                رمز عبور :{" "}
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                // value={formData.phone}
                // onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-200  text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-10 text-gray-400 cursor-pointer "
              >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}

              </button>
            </div>
            <div>
              <input
                type="submit"
                value=" تایید "
                className="bg-orange-600 text-white p-2 w-full text-center rounded-lg cursor-pointer "
              />
            </div>
          </form>
          <Link href={'/register'}  className=" text-gray-700 underline "> ایجاد حساب کاربری </Link>
        </section>
      </main>
    </>
  );
}

export default page;
