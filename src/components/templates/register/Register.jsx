"use client";

import { validatePassword, validatePhone } from "@/utils/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import swal from "sweetalert";

const options = ["دراگون", "مورتال", "4K", "گیم لند", "سبزکوه"];

export default function Register() {
  const [userName, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [isSendSms, setIsSendSms] = useState(false);

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!userName.trim()) {
      newErrors.username = "نام کاربری الزامی است";
    } else if (userName.length < 3) {
      newErrors.username = "نام کاربری باید حداقل ۳ کاراکتر باشد";
    }
    if (!phone.trim()) {
      newErrors.phone = "شماره تلفن الزامی است";
    } else if (!/^09\d{9}$/.test(phone)) {
      newErrors.phone = "شماره تلفن باید ۱۱ رقم و با ۰۹ شروع شود";
    }
    if (!password) {
      newErrors.password = "رمز عبور الزامی است";
    } else if (password.length < 8) {
      newErrors.password = "رمز عبور باید حداقل ۸ کاراکتر باشد";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "رمزهای عبور مطابقت ندارند";
    }
    if (!agreeTerms) {
      newErrors.agreeTerms = "پذیرش شرایط و قوانین الزامی است";
    }
    return newErrors;
  };

  const handleSms = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsLoading(true);

    if (
      !userName.trim() ||
      !phone ||
      !password ||
      !confirmPassword ||
      !selectedOption ||
      !agreeTerms
    ) {
      setIsLoading(false);
      return swal({
        title: "اخطار",
        text: "لطفا همه موارد را پر کنید.",
        icon: "error",
        button: "باشد",
      });
    }

    const isValidPass = await validatePassword(password);
    const isValidPhone = await validatePhone(phone);

    if (!isValidPass) {
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

    const data = {
      phone,
      userName,
    };

    const resOtp = await fetch("api/auth/sms/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (resOtp.status === 411) {
      setIsLoading(false);
      return swal({
        title: "اخطار",
        text: " این شماره قبلا با نقش ادمین وارد شده است ، جهت تغییر به مدیریت تیکت دهید. ",
        icon: "error",
        button: "باشد",
      });
    }
    if (resOtp.status === 401) {
      setIsLoading(false);
      return swal({
        title: "اخطار",
        text: "این کاربر در سایت قبلا ثبت نام کرده است.",
        icon: "error",
        button: "باشد",
      });
    }

    setIsSendSms(true);
    setIsLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const user = {
      userName,
      phone,
      password,
      confirmPassword,
      gameNet: selectedOption,
      otp,
    };

    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    res.status === 411 &&
      swal({
        title: "اخطار",
        text: " این شماره قبلا با نقش ادمین وارد شده است ، جهت تغییر به مدیریت تیکت دهید. ",
        icon: "error",
        button: "باشد",
      });
    res.status === 410 &&
      swal({
        title: "اخطار",
        text: "کد وارد شده صحیح نیست .",
        icon: "error",
        button: "باشد",
      });
    res.status === 409 &&
      swal({
        title: "اخطار",
        text: "این کاربر در سایت قبلا ثبت نام کرده است.",
        icon: "error",
        button: "باشد",
      });
    res.status === 400 &&
      swal({
        title: "اخطار",
        text: "همه موارد به خوبی تکمیل نشده اند .",
        icon: "error",
        button: "باشد",
      });
    res.status === 401 &&
      swal({
        title: "اخطار",
        text: "رمز عبور و تکرار آن را به درستی وارد نمایید .",
        icon: "error",
        button: "باشد",
      });
    res.status === 405 &&
      swal({
        title: "اخطار",
        text: "کد منقضی شده است.",
        icon: "error",
        button: "باشد",
      });
    res.status === 408 &&
      swal({
        title: "اخطار",
        text: "رمز عبور که وارد کردید صحیح نیست دقت نمایید",
        icon: "error",
        button: "باشد",
      });
    res.status === 407 &&
      swal({
        title: "اخطار",
        text: "شماره تماس به درستی وارد نشده است",
        icon: "error",
        button: "باشد",
      });
    res.status === 406 &&
      swal({
        title: "اخطار",
        text: "کد اشتباه است.",
        icon: "error",
        button: "باشد",
      });

    res.status === 200 && redirect("/p-user");

    setIsLoading(false);
  };

  return (
    <div className="h-screen bg-[url(/images/bg-mobile-register.jpg)] lg:bg-[url(/images/godOfWar.jpg)] bg-center bg-cover ">
      <main className=" w-full h-full flex items-center justify-center sm:justify-start   ">
        <div className=" w-[50%] h-full sm:backdrop-blur-xl flex items-center justify-center ">
          <section className="mx-auto px-4 flex  ">
            <div className="w-72 md:w-80 lg:w-96 mx-auto bg-black/60 sm:bg-black/90 rounded-lg shadow-lg p-4">
              <h1 className=" text-xl md:text-3xl font-bold text-center text-gold [text-shadow:_0_0_5px_#FFD700] mb-3">
                ثبت‌نام در 4K کلاب
              </h1>
              {!isSendSms ? (
                <form onSubmit={handleSms} className="space-y-1 text-sm">
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-gray-300 mb-1"
                    >
                      نام کاربری
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value.trim())}
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-gold "
                    />
                    {errors.username && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.username}
                      </p>
                    )}
                    {/* <p className="block my-1 text-gray-400 mb-1 text-xs">
                      {" "}
                      بیشتر از 5 حرف و یک حروف بزرگ و عدد و نماد باشد.{" "}
                    </p> */}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-gray-300 mb-1">
                      شماره تلفن
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="gameNet"
                      className="block text-gray-300 mb-1"
                    >
                      گیم نت
                    </label>
                    <div className="relative w-full mx-auto" ref={dropdownRef}>
                      <div
                        onClick={() => setIsOpen(!isOpen)}
                        className=" cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-md px-4 py-2 bg-gray-800 text-sm text-gray-200 shadow-sm flex justify-between items-center"
                      >
                        <span>
                          {selectedOption || "یک گزینه را انتخاب کنید"}
                        </span>
                        <svg
                          className={`w-4 h-4 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>

                      {isOpen && (
                        <div className="absolute mt-2 w-full  z-50 bg-gray-800 text-gray-200 border rounded-md shadow-lg">
                          <input
                            type="text"
                            className="w-full p-2 focus:outline-none text-sm"
                            placeholder="جستجو..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                          <ul className="max-h-40 overflow-y-auto">
                            {filteredOptions.length === 0 ? (
                              <li className="p-2 text-sm text-gray-500">
                                موردی یافت نشد
                              </li>
                            ) : (
                              filteredOptions.map((option) => (
                                <li
                                  key={option}
                                  onClick={() => {
                                    setSelectedOption(option);
                                    setIsOpen(false);
                                    setSearchTerm("");
                                  }}
                                  className="p-2 hover:bg-blue-500 hover:text-white cursor-pointer text-sm"
                                >
                                  {option}
                                </li>
                              ))
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="relative">
                    <label
                      htmlFor="password"
                      className="block text-gray-300 mb-1"
                    >
                      رمز عبور
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-9 text-gray-400"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>
                  <div className="relative">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-gray-300 mb-1"
                    >
                      تکرار رمز عبور
                    </label>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute left-3 top-9 text-gray-500 dark:text-gray-400"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      name="agreeTerms"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.value)}
                      className="h-4 w-4 text-gold focus:ring-gold border-gray-600 rounded"
                    />
                    <label
                      htmlFor="agreeTerms"
                      className="mr-2 text-gray-300 text-sm"
                    >
                      <a href="/terms" className="text-gold hover:underline">
                        شرایط و قوانین
                      </a>{" "}
                      را می‌پذیرم
                    </label>
                  </div>
                  {errors.agreeTerms && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.agreeTerms}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full bg-gold text-gray-900 font-vazir py-3 rounded-lg hover:bg-yellow-300  transition duration-300 [text-shadow:_0_0_5px_#FFD700] flex items-center justify-center ${
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
                  {errors.api && (
                    <p className="text-red-500 text-sm text-center mt-4">
                      {errors.api}
                    </p>
                  )}
                </form>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="phone" className="block text-gray-300 mb-1">
                      کد ارسال شده
                    </label>
                    <input
                      type="code"
                      id="code"
                      name="code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="756515"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full bg-gold text-gray-900 font-vazir py-3 rounded-lg hover:bg-yellow-300  transition duration-300 [text-shadow:_0_0_5px_#FFD700] flex items-center justify-center ${
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
              )}

              <p className="text-center text-gray-300 font-vazir mt-4">
                آیا قبلاً ثبت‌نام کرده‌اید؟{" "}
                <Link href="/login" className="text-gold hover:underline">
                  ورود
                </Link>
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
