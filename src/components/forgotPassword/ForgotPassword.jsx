"use client";

import { validatePassword, validatePhone } from "@/utils/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import swal from "sweetalert";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [code, setSmsCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const submitNumber = async (e) => {
    e.preventDefault();
    const isValidPhone = await validatePhone(phone);
    if (!isValidPhone) {
      return swal({
        title: "اخطار",
        text: " شماره همراه خالی است یا به درستی وارد نشده است. ",
        icon: "error",
        button: "باشد",
      });
    }
    const role = {
      phone,
    };
    const res = await fetch("/api/auth/forgotPassword/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(role),
    });
    if (res.status === 200 || res.status === 201) {
      setStep(2);
    }
    if (res.status === 402) {
      return swal({
        title: "اخطار",
        text: " شماره همراه خالی است یا به درستی وارد نشده است. ",
        icon: "error",
        button: "باشد",
      });
    } else if (res.status === 404) {
      return swal({
        title: "اخطار",
        text: " کاربری||نقشی یافت نشد . ",
        icon: "error",
        button: "باشد",
      });
    }
  };

  const verifyCode = async (e) => {
    e.preventDefault();
    if (code) {
      const codeOtp = {
        code,
        phone,
      };
      const checkCode = await fetch("/api/auth/forgotPassword/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(codeOtp),
      });
      if (checkCode.status === 200) {
        setStep(3);
      } else if (checkCode.status === 410) {
        return swal({
          title: "اخطار",
          text: " عدم ارسال کد به این شماره همراه ",
          icon: "error",
          button: "باشد",
        });
      } else if (checkCode.status === 405) {
        return swal({
          title: "اخطار",
          text: " کد منقضی شده است، زمان ارسال تا تائید کد 2 دقیقه است. ",
          icon: "error",
          button: "باشد",
        });
      } else if (checkCode.status === 406) {
        return swal({
          title: "اخطار",
          text: " کد اشتباه است ",
          icon: "error",
          button: "باشد",
        });
      }
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return swal({
        title: "اخطار",
        text: " رمز و تکرار آن یکسان نیست ",
        icon: "error",
        button: "باشد",
      });
    }
    const isValidPassword = await validatePassword(password);
    const isValidConfirmPassword = await validatePassword(confirmPassword);
    if (!isValidConfirmPassword || !isValidPassword) {
      return swal({
        title: "اخطار",
        text: " رمز یا تکرار رمز اشتباه می باشد.",
        icon: "error",
        button: "باشد",
      });
    }
    const resetPass = {
      phone,
      password,
    };
    const res = await fetch("/api/auth/forgotPassword/resetPassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resetPass),
    });

    res.status === 200 && redirect("/login");
    res.status === 201 && redirect("/login-admin");

    if (res.status === 401) {
      return swal({
        title: "اخطار",
        text: " رمز صحیح نمی باشد.",
        icon: "error",
        button: "باشد",
      });
    } else if (res.status === 402) {
      return swal({
        title: "اخطار",
        text: " شماره تماس صحیح نیست. ",
        icon: "error",
        button: "باشد",
      });
    } else if (res.status === 405) {
      return swal({
        title: "اخطار",
        text: " کاربر || نقشی یافت نشد. ",
        icon: "error",
        button: "باشد",
      });
    }
  };

  return (
    <>
      <main className="flex items-center justify-center  w-full h-screen bg-lime-200">
        <section className="sm:w-96  w-80 h-80 bg-white rounded-xl flex flex-col items-start gap-3 sm:gap-10 p-3 ">
          <h1 className="text-orange-600 text-2xl font-bold">
            {" "}
            فراموشی رمز عبور{" "}
          </h1>
          <form className="w-full space-y-4">
            {step === 1 && (
              <>
                <div>
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
                <div>
                  <input
                    type="submit"
                    onClick={(e) => submitNumber(e)}
                    value=" تایید "
                    className="bg-orange-600 text-white p-2 w-full text-center rounded-lg cursor-pointer "
                  />
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <div className={`relative`}>
                  <label
                    htmlFor="password"
                    className="block text-gray-600 mb-1"
                  >
                    {" "}
                    کد پیامک شده:{" "}
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={code}
                    onChange={(e) => setSmsCode(e.target.value)}
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
                    onClick={(e) => verifyCode(e)}
                    value=" تایید "
                    className="bg-orange-600 text-white p-2 w-full text-center rounded-lg cursor-pointer "
                  />
                </div>
              </>
            )}
            {step === 3 && (
              <>
                <input
                  type="text"
                  placeholder="رمز جدید"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="تکرار رمز جدید"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border p-2 rounded mt-2"
                />
                <button
                  onClick={(e) => handleResetPassword(e)}
                  className="bg-green-600 text-white px-4 py-2 rounded w-full"
                >
                  تغییر رمز
                </button>
              </>
            )}
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

export default ForgotPassword;
