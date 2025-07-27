"use client";
import { validatePassword, validatePhone } from "@/utils/auth";
import Link from "next/link";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import swal from "sweetalert";
import { redirect } from "next/navigation";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!phone || !password) {
      setIsLoading(false);
      return swal({
        title: "اخطار",
        text: "لطفا همه موارد را پر کنید.",
        icon: "error",
        button: "باشد",
      });
    }
    const isValidPassword = await validatePassword(password);
    const isValidPhone = await validatePhone(phone);
    if (!isValidPassword) {
      setIsLoading(false);

      return swal({
        title: "اخطار",
        text: " رمز عبور را به درستی وارد نمایید. ",
        icon: "error",
        button: "باشد",
      });
    }
    if (!isValidPhone) {
      setIsLoading(false);

      return swal({
        title: "اخطار",
        text: " شماره تماس معتبر نمی باشد. ",
        icon: "error",
        button: "باشد",
      });
    }
    const user = {
      phone,
      password,
    };
    const res = await fetch("/api/auth/loginUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    res.status === 200 && redirect ("/p-user")
      swal({
        title: "اخطار",
        text: "همه موارد را خالی نگذارید",
        icon: "success",
        button: "باشد",
      });

    setIsLoading(false);

    if (res.status === 400) {
      swal({
        title: "اخطار",
        text: "همه موارد را خالی نگذارید",
        icon: "error",
        button: "باشد",
      });
    } else if (res.status === 403) {
      swal({
        title: "اخطار",
        text: "عدم مغایرت رمز عبور جدید و قبلی",
        icon: "error",
        button: "باشد",
      });
    } else if (res.status === 401) {
      swal({
        title: "اخطار",
        text: "رمز عبور معتبر نیست",
        icon: "error",
        button: "باشد",
      });
    } else if (res.status === 402) {
      swal({
        title: "اخطار",
        text: "شماره تماس را به درستی وارد نکردید",
        icon: "error",
        button: "باشد",
      });
    } else if (res.status === 404) {
      swal({
        title: "اخطار",
        text: "کاربری با این اطلاعات یافت نشد",
        icon: "error",
        button: "باشد",
      });
    }
  };
  return (
    <>
      <main className="flex items-center justify-center  w-full h-screen bg-lime-200">
        <section className="sm:w-96 sm:h-[450px] w-80 h-96 bg-white rounded-xl flex flex-col items-start gap-3 sm:gap-10 p-3 ">
          <h1 className="text-gold text-2xl font-bold"> ورود به 4K کلاب </h1>
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
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-gold text-gray-900 font-vazir py-3 rounded-lg hover:bg-yellow-300  transition duration-300 [text-shadow:_0_0_5px_#FFD700] flex items-center justify-center ${
                  isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:scale-105 transform"
                }`}
              >
                {" "}
                تائید{" "}
              </button>
            </div>
          </form>
          <Link href={"/register"} className=" text-gray-700 underline ">
            {" "}
            ایجاد حساب کاربری{" "}
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

export default Login;
