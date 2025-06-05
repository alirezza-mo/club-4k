'use client';

import { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    message: '',
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.name) return 'لطفاً نام خود را وارد کنید.';
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      return 'لطفاً یک ایمیل معتبر وارد کنید.';
    if (!formData.title) return 'لطفاً موضوع را وارد کنید.';
    if (!formData.message) return 'لطفاً پیام خود را وارد کنید.';
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setStatus({ type: 'error', message: error });
      return;
    }
    // شبیه‌سازی ارسال فرم (بعداً به API وصل کنید)
    setStatus({ type: 'loading', message: 'در حال ارسال...' });
    setTimeout(() => {
      setStatus({ type: 'success', message: 'پیام شما با موفقیت ارسال شد!' });
      setFormData({ name: '', email: '', title: '', message: '' });
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto font-vazir">
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 dark:text-gray-200 mb-2">
          نام
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-orange-600 dark:border-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:focus:ring-yellow-400 shadow-yellow-glow transition duration-300"
          placeholder="نام شما"
          aria-label="نام"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 dark:text-gray-200 mb-2">
          ایمیل
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-orange-600 dark:border-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:focus:ring-yellow-400 shadow-yellow-glow transition duration-300"
          placeholder="ایمیل شما"
          aria-label="ایمیل"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700 dark:text-gray-200 mb-2">
          موضوع
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-orange-600 dark:border-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:focus:ring-yellow-400 shadow-yellow-glow transition duration-300"
          placeholder="موضوع پیام"
          aria-label="موضوع"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="message" className="block text-gray-700 dark:text-gray-200 mb-2">
          پیام
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          className="w-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-orange-600 dark:border-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:focus:ring-yellow-400 shadow-yellow-glow transition duration-300"
          rows="5"
          placeholder="پیام خود را بنویسید..."
          aria-label="پیام"
        />
      </div>
      {status && (
        <p
          className={`text-center mb-4 ${
            status.type === 'error' ? 'text-red-500' : status.type === 'success' ? 'text-green-500' : 'text-orange-600 dark:text-yellow-400'
          }`}
        >
          {status.message}
        </p>
      )}
      <button
        type="submit"
        className="w-full bg-orange-600 dark:bg-yellow-400 text-white dark:text-gray-900 font-vazir px-6 py-3 rounded-lg shadow-yellow-glow hover:shadow-bronze-glow hover:bg-orange-700 dark:hover:bg-yellow-500 transition duration-300 flex items-center justify-center gap-2"
        disabled={status?.type === 'loading'}
      >
        <FaPaperPlane />
        ارسال پیام
      </button>
    </form>
  );
}