"use client";
import { validatePassword, validatePhone } from "@/utils/auth";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import swal from "sweetalert";
import Link from "next/link";

function RegisterAdmin() {
  const [isLoading, setIsLoading] = useState(false);
  const [gameNet, setGameNet] = useState("");
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!gameNet.trim() || !code.trim() || !phone.trim() || !password.trim()) {
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
        text: "رمز عبور شامل یک حرف بزرک، یک عدد و یک نماد باشد",
        icon: "error",
        button: "باشد",
      });
    }
    if (!isValidPhone) {
      setIsLoading(false);
      return swal({
        title: "اخطار",
        text: "شماره ای که وارد کردید صحیح نیست",
        icon: "error",
        button: "باشد",
      });
    }

    const admin = {
      gameNet,
      code,
      phone,
      password,
    };

    const res = await fetch("api/auth/registerAdmin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(admin),
    });
    console.log(res);


    res.status === 400 &&
      swal({
        title: "اخطار",
        text: "همه موارد را به درستی وارد نمایید",
        icon: "error",
        button: "باشد",
      });
    res.status === 409 &&
      swal({
        title: "اخطار",
        text: "این گیم نت | ادمین قبلا در سایت وجود داشته است.",
        icon: "error",
        button: "باشد",
      });
    res.status === 408 &&
      swal({
        title: "اخطار",
        text: "رمز عبور معتبر نیست. باید شامل یک حرف بزرگ انگلیسی، یک عدد و یک نماد باشد.",
        icon: "error",
        button: "باشد",
      });
    res.status === 407 &&
      swal({
        title: "اخطار",
        text: "شماره تماس اشتباه است",
        icon: "error",
        button: "باشد",
      });
    res.status === 410 &&
      swal({
        title: "اخطار",
        text: "کد های شناسایی مغایرت ندارد.",
        icon: "error",
        button: "باشد",
      });
      res.status === 411 &&
      swal({
        title: "اخطار",
        text: "این شماره تماس قبلاً با نقش کاربر وارد شده است .",
        icon: "error",
        button: "باشد",
      });
    res.status === 200 && redirect("/p-admin");
  };

  return (
    <div className="h-screen bg-[url(/images/bg-mobile-register.jpg)] lg:bg-[url(/images/godOfWar.jpg)] bg-center bg-cover ">
      <main className=" w-full h-full flex items-center justify-center sm:justify-start   ">
        <div className=" w-[50%] h-full sm:backdrop-blur-xl flex items-center justify-center ">
          <section className="mx-auto px-4 flex  ">
            <div className="w-72 md:w-80 lg:w-96 mx-auto bg-black/60 sm:bg-black/90 rounded-lg shadow-lg p-4">
              <h1 className="text-white font-bold mb-3"> ثبت نام ادمین </h1>
              <form
                action="register-admin"
                className="space-y-1 text-sm"
                onSubmit={handleSubmit}
              >
                <div>
                  <label htmlFor="gameNet" className="block text-gray-300 mb-1">
                    {" "}
                    نام گیم نت :{" "}
                  </label>
                  <input
                    value={gameNet}
                    onChange={(e) => setGameNet(e.target.value.trim())}
                    type="text"
                    placeholder="نام گیم نت خود را وارد نمایید .."
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div>
                  <label htmlFor="gameNet" className="block text-gray-300 mb-1">
                    {" "}
                    کد معرف:{" "}
                  </label>
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value.trim())}
                    type="text"
                    placeholder="کد معرف خود را وارد نمایید.."
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div>
                  <label htmlFor="gameNet" className="block text-gray-300 mb-1">
                    {" "}
                    شماره تماس:{" "}
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    type="text"
                    placeholder="شماره تماس خود را وارد نمایید.."
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div>
                  <label htmlFor="gameNet" className="block text-gray-300 mb-1">
                    {" "}
                    رمز عبور:{" "}
                  </label>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="رمز عبور خود را وارد نمایید .."
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`my-3 w-full bg-gold text-gray-900 font-vazir py-3 rounded-lg hover:bg-yellow-300  transition duration-300 [text-shadow:_0_0_5px_#FFD700] flex items-center justify-center ${
                    isLoading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:scale-105 transform"
                  }`}
                >
                  {isLoading ? (
                    <svg
                      className="animate-spin h-5 w-5 ml-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        strokeWidth="4"
                        className="opacity-25"
                      />
                      <path
                        d="M4 12a8 8 0 018-8"
                        strokeWidth="4"
                        className="opacity-75"
                      />
                    </svg>
                  ) : (
                    "ثبت‌نام"
                  )}
                </button>
              </form>
              <div className="flex flex-col justify-center items-start">
                <Link href={"/login-admin"} className="text-blue-600">
                  {" "}
                  قبلا ثبت نام کرده اید ؟{" "}
                </Link>
                <Link href={"/"} className="text-gold my-1">
                  {" "}
                  رفتن به صفحه اصلی{" "}
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default RegisterAdmin;
