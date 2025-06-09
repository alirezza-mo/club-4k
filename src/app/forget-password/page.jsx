"use client";

import Link from "next/link";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function page() {
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [showSmsCode, setShowSmsCode] = useState(false);
  const [smsCode , setSmsCode] = useState("")

  const submitNumber = (e) => {
    e.preventDefault();
    if (phone) {
      console.log("ok");
      setShowSmsCode(true);
    }
  };

  const handleChange = (e) => {
    setPhone(e.target.value)
  }

  return (
    <>
      <main className="flex items-center justify-center  w-full h-screen bg-lime-200">
        <section className="sm:w-96  w-80 h-80 bg-white rounded-xl flex flex-col items-start gap-3 sm:gap-10 p-3 ">
          <h1 className="text-orange-600 text-2xl font-bold">
            {" "}
            فراموشی رمز عبور{" "}
          </h1>
          <form className="w-full space-y-4">
            <div className={`${showSmsCode ? "hidden" : "block" }  `}>
              <label htmlFor="phone" className="block text-gray-600 mb-1">
                {" "}
                شماره تلفن :{" "}
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-200  text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-300"
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
              />
            </div>
            <div className={`relative ${showSmsCode ? 'block' : "hidden" } `}>
              <label htmlFor="password" className="block text-gray-600 mb-1">
                {" "}
                کد پیامک شده:{" "}
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={smsCode}
                onChange={ e => setShowSmsCode(e.target.value) }
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
                onClick={(e) => submitNumber(e)}
                value=" تایید "
                className="bg-orange-600 text-white p-2 w-full text-center rounded-lg cursor-pointer "
              />
            </div>
          </form>
          <Link href={"/register"} className=" text-gray-700 underline ">
            {" "}
            ایجاد حساب کاربری{" "}
          </Link>
        </section>
      </main>
    </>
  );
}

export default page;
