'use client';

import { useState } from 'react';

const fakeTicket = {
  id: 1,
  title: 'مشکل در ورود به حساب',
  user: 'علی رضایی',
  createdAt: '1403/03/22 - 10:45',
  status: 'در حال بررسی',
  messages: [
    { sender: 'user', content: 'سلام، من نمی‌تونم وارد حسابم بشم.', date: '1403/03/22 - 10:45' },
    { sender: 'admin', content: 'سلام. لطفاً مطمئن شوید که رمز درست است.', date: '1403/03/22 - 11:00' },
  ],
};

export default function AdminTicketView() {
  const [reply, setReply] = useState('');
  const [messages, setMessages] = useState(fakeTicket.messages);
  const [status, setStatus] = useState(fakeTicket.status);

  const handleReply = () => {
    if (!reply.trim()) return;
    const newMessage = {
      sender: 'admin',
      content: reply,
      date: new Date().toLocaleString('fa-IR'),
    };
    setMessages([...messages, newMessage]);
    setReply('');
    setStatus('پاسخ داده شده');
  };

  return (
    <div className="font-vazir p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 dark:text-yellow-400 text-orange-600">
        مشاهده تیکت
      </h2>

      <div className="bg-white dark:bg-gray-900 border border-orange-400 dark:border-yellow-400 p-4 rounded-lg shadow">
        <div className="mb-4">
          <p><span className="font-bold">عنوان:</span> {fakeTicket.title}</p>
          <p><span className="font-bold">کاربر:</span> {fakeTicket.user}</p>
          <p><span className="font-bold">تاریخ:</span> {fakeTicket.createdAt}</p>
          <p>
            <span className="font-bold">وضعیت:</span>
            <select
              className="ml-2 bg-gray-100 dark:bg-gray-800 text-sm p-1 rounded"
              value={status}
              onChange={e => setStatus(e.target.value)}
            >
              <option value="در حال بررسی">در حال بررسی</option>
              <option value="پاسخ داده شده">پاسخ داده شده</option>
              <option value="بسته شده">بسته شده</option>
            </select>
          </p>
        </div>

        {/* Messages */}
        <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-md shadow-sm text-sm w-fit ${
                msg.sender === 'user'
                  ? 'bg-orange-100 dark:bg-gray-800 text-right ml-auto'
                  : 'bg-yellow-100 dark:bg-gray-700 text-left mr-auto'
              }`}
            >
              <p>{msg.content}</p>
              <p className="text-xs mt-2 text-gray-500">{msg.date}</p>
            </div>
          ))}
        </div>

        {/* Reply */}
        <div>
          <textarea
            placeholder="پاسخ خود را بنویسید..."
            className="w-full bg-gray-50 dark:bg-gray-800 border border-orange-400 dark:border-yellow-400 p-3 rounded resize-none text-sm mb-4"
            rows={4}
            value={reply}
            onChange={e => setReply(e.target.value)}
          />
          <button
            onClick={handleReply}
            className="bg-orange-600 hover:bg-orange-500 dark:bg-yellow-500 dark:hover:bg-yellow-400 text-white dark:text-black px-5 py-2 rounded"
          >
            ارسال پاسخ
          </button>
        </div>
      </div>
    </div>
  );
}
