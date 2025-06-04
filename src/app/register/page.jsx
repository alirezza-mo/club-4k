"use client";

import Link from "next/link";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = "نام کاربری الزامی است";
    } else if (formData.username.length < 3) {
      newErrors.username = "نام کاربری باید حداقل ۳ کاراکتر باشد";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "شماره تلفن الزامی است";
    } else if (!/^09\d{9}$/.test(formData.phone)) {
      newErrors.phone = "شماره تلفن باید ۱۱ رقم و با ۰۹ شروع شود";
    }
    if (!formData.password) {
      newErrors.password = "رمز عبور الزامی است";
    } else if (formData.password.length < 8) {
      newErrors.password = "رمز عبور باید حداقل ۸ کاراکتر باشد";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "رمزهای عبور مطابقت ندارند";
    }
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "پذیرش شرایط و قوانین الزامی است";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsLoading(true);
    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Fake delay
      // TODO: Replace with actual API call
      console.log("Form submitted:", formData);
      alert("ثبت‌نام با موفقیت انجام شد! به صفحه ورود هدایت می‌شوید.");
      // Redirect to login: window.location.href = '/login';
    } catch (error) {
      setErrors({ api: "خطایی در ثبت‌نام رخ داد" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[url(/images/bg-mobile-register.jpg)] lg:bg-[url(/images/godOfWar.jpg)] bg-center bg-cover ">
      <main className=" w-full h-full flex items-center justify-center sm:justify-start   ">
        <div className=" w-[50%] h-full sm:backdrop-blur-xl flex items-center justify-center ">
          <section className="mx-auto px-4 flex  ">
            <div className="w-72 md:w-80 lg:w-96 mx-auto bg-black/60 sm:bg-black/90 rounded-lg shadow-lg p-6">
              <h1 className="font-inter text-xl md:text-3xl font-bold text-center text-gold [text-shadow:_0_0_5px_#FFD700] mb-6">
                ثبت‌نام در 4K کلاب
              </h1>
              <form onSubmit={handleSubmit} className="space-y-4 font-vazir">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-gray-700 dark:text-gray-300 mb-1"
                  >
                    نام کاربری
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-gold "
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.username}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-gray-300 mb-1"
                  >
                    شماره تلفن
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
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
                    value={formData.password}
                    onChange={handleChange}
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
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="h-4 w-4 text-gold focus:ring-gold border-gray-600 rounded"
                  />
                  <label
                    htmlFor="agreeTerms"
                    className="mr-2 text-gray-300 text-sm"
                  >
                    <a
                      href="/terms"
                      className="text-gold hover:underline"
                    >
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
              <p className="text-center text-gray-300 font-vazir mt-4">
                آیا قبلاً ثبت‌نام کرده‌اید؟{" "}
                <Link
                  href="/login"
                  className="text-gold hover:underline"
                >
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
