"use client";
import { validatePassword, validatePhone } from "@/utils/auth";
import Link from "next/link";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import swal from "sweetalert";
import { redirect } from "next/navigation";


function LoginAdmin() {
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!phone || !code || !password) {
      return swal({
        title: "اخطار",
        text: "همه موارد را به درستی وارد نمایید",
        icon: "error",
        button: "باشد",
      });
    }
    const validPhone = await validatePhone(phone);
    const validPass = await validatePassword(password);
    if (!validPass) {
      setIsLoading(false);
      return swal({
        title: "اخطار",
        text: "رمز عبور شامل یک حرف بزرک، یک عدد و یک نماد باشد",
        icon: "error",
        button: "باشد",
      });
    }
    if (!validPhone) {
      setIsLoading(false);
      return swal({
        title: "اخطار",
        text: "شماره ای که وارد کردید صحیح نیست",
        icon: "error",
        button: "باشد",
      });
    }
    const admin = {
      code,
      phone,
      password,
    };

    const res = await fetch("api/auth/loginAdmin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(admin),
    });
    res.status === 200 && redirect("/p-admin")
    
    res.status === 400 && 
      swal({
        title: "اخطار",
        text: "رمز عبور شامل یک حرف بزرک، یک عدد و یک نماد باشد",
        icon: "error",
        button: "باشد",
      });
      res.status === 404 &&
      swal({
        title: "اخطار",
        text: " گیم نت / ادمین مورد نظر یافت نشد ",
        icon: "error",
        button: "باشد",
      });
      res.status === 401 &&
      swal({
        title: "اخطار",
        text: "رمز عبور شما نادرست است ( عدم تطابق با رمز قبلی)",
        icon: "error",
        button: "باشد",
      });
      res.status === 402 &&
      swal({
        title: "اخطار",
        text: " کد شناسایی را به درستی وارد نمایید ",
        icon: "error",
        button: "باشد",
      });

  };

  return (
    <>
      <main className="flex items-center justify-center  w-full h-screen bg-lime-200">
        <section className="sm:w-96 sm:h-[550px] w-80 h-[450px] bg-white rounded-xl flex flex-col items-start gap-3 sm:gap-10 p-3 ">
          <h1 className="text-orange-600 text-2xl font-bold"> عضویت ادمین </h1>
          <form onSubmit={handleLogin} className="w-full space-y-4">
            <div className="">
              <label htmlFor="phone" className="block text-gray-600 mb-1">
                {" "}
                شماره تلفن :{" "}
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-200  text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-300"
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
              />
            </div>
            <div className="">
              <label htmlFor="phone" className="block text-gray-600 mb-1">
                {" "}
                کد شناسایی:{" "}
              </label>
              <input
                type="text"
                id="code"
                name="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-200  text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-300"
                placeholder="11111111"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          <Link href={"/register-admin"} className=" text-gray-700 underline ">
            {" "}
            ایجاد حساب {" "}
          </Link>
          <Link href={"/forget-password"} className=" text-gray-700 underline ">
            {" "}
            فراموشی رمز عبور{" "}
          </Link>
        </section>
      </main>
    </>
  );
}

export default LoginAdmin;
