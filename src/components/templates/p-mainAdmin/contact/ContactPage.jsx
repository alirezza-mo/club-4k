'use client';

import { useEffect, useState } from 'react';
import { FaTrash, FaEnvelopeOpen, FaEnvelope } from 'react-icons/fa';

export default function ContactPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);

  // 📦 گرفتن لیست پیام‌ها
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/contact');
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: 'خطا در دریافت پیام‌ها' });
    } finally {
      setLoading(false);
    }
  };

  // 📍 حذف پیام
  const deleteMessage = async (id) => {
    if (!confirm('آیا از حذف این پیام مطمئن هستید؟')) return;
    try {
      const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMessages(messages.filter((msg) => msg._id !== id));
      setStatus({ type: 'success', message: 'پیام حذف شد.' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  // ✉️ تغییر وضعیت خوانده / نخوانده
  const toggleReadStatus = async (id, currentStatus) => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: !currentStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMessages(messages.map((msg) => (msg._id === id ? { ...msg, isRead: !currentStatus } : msg)));
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 font-vazir">
      <h1 className="text-2xl font-bold text-orange-600 dark:text-yellow-400 mb-6">
        مدیریت پیام‌های تماس با ما
      </h1>

      {status && (
        <p
          className={`mb-4 ${
            status.type === 'error' ? 'text-red-500' : 'text-green-500'
          }`}
        >
          {status.message}
        </p>
      )}

      {loading ? (
        <p className="text-gray-500">در حال بارگذاری...</p>
      ) : messages.length === 0 ? (
        <p className="text-gray-500">هیچ پیامی یافت نشد.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`p-4 border rounded-lg shadow-sm ${
                msg.isRead
                  ? 'border-gray-300 bg-gray-50 dark:bg-gray-800'
                  : 'border-orange-500 bg-white dark:bg-gray-700'
              } transition`}
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                  {msg.title}
                </h2>
                <div className="flex gap-3">
                  <button
                    onClick={() => toggleReadStatus(msg._id, msg.isRead)}
                    className="text-orange-600 hover:text-orange-800 dark:text-yellow-400 dark:hover:text-yellow-300 transition"
                  >
                    {msg.isRead ? <FaEnvelopeOpen /> : <FaEnvelope />}
                  </button>
                  <button
                    onClick={() => deleteMessage(msg._id)}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-200 mb-1">
                <strong>نام:</strong> {msg.name}
              </p>
              <p className="text-gray-700 dark:text-gray-200 mb-1">
                <strong>ایمیل:</strong> {msg.email}
              </p>
              <p className="text-gray-700 dark:text-gray-200 mb-1">
                <strong>پیام:</strong> {msg.message}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                ارسال شده در: {new Date(msg.createdAt).toLocaleString('fa-IR')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
