'use client';

import { useState } from 'react';
import { FiEye } from 'react-icons/fi';
import { FaSearch } from 'react-icons/fa';
import TicketModal from './TicketModal';

const demoTickets = [
  {
    id: 1,
    user: 'علی رضایی',
    title: 'مشکل در ورود به حساب',
    createdAt: '1403/03/22 - 10:45',
    status: 'در حال بررسی',
  },
  {
    id: 2,
    user: 'farhad',
    title: 'سوال درباره چلنج',
    createdAt: '1403/03/21 - 18:20',
    status: 'پاسخ داده شده',
  },
  // ...
];

export default function AdminTicketsTable() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const ticketsPerPage = 5;

  const handleReply = (ticketId, replyText) => {
  // اینجا می‌تونی به API ارسال کنی یا ذخیره کنی
  console.log(`پاسخ به تیکت ${ticketId}: ${replyText}`);
  // اگر خواستی بعداً وضعیت پاسخ داده شده را تغییر بده
};


  const filteredTickets = demoTickets
    .filter(ticket =>
      ticket.title.includes(search) || ticket.user.includes(search)
    )
    .filter(ticket => (statusFilter ? ticket.status === statusFilter : true));
    
    
  const indexOfLast = currentPage * ticketsPerPage;
  const indexOfFirst = indexOfLast - ticketsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

  return (
    <div className="font-vazir p-4">
      <h2 className="text-2xl font-bold mb-4 dark:text-yellow-400 text-orange-600">
        تیکت‌های کاربران
      </h2>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
        <div className="flex items-center bg-white dark:bg-gray-800 border border-orange-500 dark:border-yellow-400 rounded px-3 py-1">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="جستجو بر اساس عنوان یا نام کاربر"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm dark:text-white"
          />
        </div>
        <select
          className="bg-white dark:bg-gray-800 border border-orange-500 dark:border-yellow-400 text-sm text-gray-800 dark:text-white px-4 py-2 rounded"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">همه وضعیت‌ها</option>
          <option value="در حال بررسی">در حال بررسی</option>
          <option value="پاسخ داده شده">پاسخ داده شده</option>
          <option value="خوانده شده">خوانده شده</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full bg-white dark:bg-gray-900 text-sm overflow-x-scroll">
          <thead>
            <tr className="text-right bg-orange-100 dark:bg-gold text-orange-800 dark:text-yellow-300">
              <th className="py-3 px-4">عنوان</th>
              <th className="py-3 px-4">کاربر</th>
              <th className="py-3 px-4">تاریخ</th>
              <th className="py-3 px-4">وضعیت</th>
              <th className="py-3 px-4">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {currentTickets.map(ticket => (
              <tr
                key={ticket.id}
                className="border-b border-gray-200 dark:text-white dark:border-gray-700 hover:bg-orange-50 dark:hover:bg-gray-800"
              >
                <td className="py-2 px-4">{ticket.title}</td>
                <td className="py-2 px-4">{ticket.user}</td>
                <td className="py-2 px-4">{ticket.createdAt}</td>
                <td className="py-2 px-4">{ticket.status}</td>
                <td className="py-2 px-4">
                  <button className="text-orange-600 dark:text-gold hover:underline flex items-center gap-1" onClick={() => setSelectedTicket(ticket)} >
                    <FiEye />
                    مشاهده
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPage(idx + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === idx + 1
                ? 'bg-orange-600 text-white dark:bg-gold dark:text-black'
                : 'bg-white dark:bg-gray-800 border-orange-400 dark:border-gold text-gray-700 dark:text-white'
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
       {selectedTicket && (
        <TicketModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onReply={handleReply}
        />
      )}
     
    </div>
  );
}
