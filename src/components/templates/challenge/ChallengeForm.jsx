"use client";

import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
// import LoadingSpinner from "./LoadingSpinner";

export default function ChallengeForm({ onChallengeCreated, users }) {
  const [formData, setFormData] = useState({
    opponent: "",
    game: "",
    dateTime: "",
    prize: "",
    message: "",
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.opponent) return "حریف را انتخاب کنید.";
    if (!formData.game) return "بازی را انتخاب کنید.";
    if (!formData.dateTime) return "تاریخ و زمان را وارد کنید.";
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setStatus({ type: "error", message: error });
      return;
    }
    setStatus({ type: "loading", message: "در حال ارسال دعوت..." });
    // شبیه‌سازی API
    setTimeout(() => {
      setStatus({ type: "success", message: "دعوت‌نامه ارسال شد!" });
      onChallengeCreated({ ...formData, id: Date.now(), status: "pending" });
      setFormData({
        opponent: "",
        game: "",
        dateTime: "",
        prize: "",
        message: "",
      });
    }, 1000);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg mx-auto font-vazir"
    >
      <div className="mb-4">
        <label
          htmlFor="opponent"
          className="block text-gray-700 dark:text-gray-200 mb-2"
        >
          حریف
        </label>
        <select
          id="opponent"
          name="opponent"
          value={formData.opponent}
          onChange={handleChange}
          className="w-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-orange-600 dark:border-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:focus:ring-yellow-400 shadow-yellow-glow transition duration-300"
          aria-label="حریف"
        >
          <option value="" disabled>
            انتخاب حریف
          </option>
          {users.map((user) => (
            <option key={user.id} value={user.name}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label
          htmlFor="game"
          className="block text-gray-700 dark:text-gray-200 mb-2"
        >
          بازی
        </label>
        <select
          id="game"
          name="game"
          value={formData.game}
          onChange={handleChange}
          className="w-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-orange-600 dark:border-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:focus:ring-yellow-400 shadow-yellow-glow transition duration-300"
          aria-label="بازی"
        >
          <option value="" disabled>
            انتخاب بازی
          </option>
          <option value="FIFA 23">FIFA 23</option>
          <option value="Call of Duty">Call of Duty</option>
          <option value="Valorant">Valorant</option>
          <option value="PUBG">PUBG</option>
        </select>
      </div>
      <div className="mb-4">
        <label
          htmlFor="dateTime"
          className="block text-gray-700 dark:text-gray-200 mb-2"
        >
          تاریخ و زمان
        </label>
        <input
          type="datetime-local"
          id="dateTime"
          name="dateTime"
          value={formData.dateTime}
          onChange={handleChange}
          className="w-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-orange-600 dark:border-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:focus:ring-yellow-400 shadow-yellow-glow transition duration-300"
          aria-label="تاریخ و زمان"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="prize"
          className="block text-gray-700 dark:text-gray-200 mb-2"
        >
          جایزه (اختیاری)
        </label>
        <input
          type="text"
          id="prize"
          name="prize"
          value={formData.prize}
          onChange={handleChange}
          className="w-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-orange-600 dark:border-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:focus:ring-yellow-400 shadow-yellow-glow transition duration-300"
          placeholder="مثال: 100,000 تومان"
          aria-label="جایزه"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="message"
          className="block text-gray-700 dark:text-gray-200 mb-2"
        >
          پیام دعوت
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          className="w-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-orange-600 dark:border-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:focus:ring-yellow-400 shadow-yellow-glow transition duration-300"
          rows="3"
          placeholder="مثال: آماده‌ای ببازی؟"
          aria-label="پیام دعوت"
        />
      </div>
      {status && (
        <div className="text-center mb-4">
         
            <p
              className={
                status.type === "error" ? "text-red-500" : "text-green-500"
              }
            >
              {status.message}
            </p>
          
        </div>
      )}
      <button
        type="submit"
        className="w-full bg-orange-600 dark:bg-yellow-400 text-white dark:text-gray-900 font-vazir px-6 py-3 rounded-lg shadow-yellow-glow hover:shadow-bronze-glow hover:bg-orange-700 dark:hover:bg-yellow-500 transition duration-300 flex items-center justify-center gap-2"
        disabled={status?.type === "loading"}
      >
        <FaPaperPlane />
        ارسال دعوت
      </button>
    </form>
  );
}
