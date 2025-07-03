import { useState } from "react";

export default function TicketModal({ ticket, onClose, onReply }) {
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reply.trim()) return;

    setSending(true);

    // شبیه‌سازی ارسال پاسخ
    setTimeout(() => {
      onReply(ticket.id, reply);
      setSending(false);
      setReply("");
      onClose();
    }, 1000);
  };

  if (!ticket) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-[90%] sm:w-[600px] p-6 text-gray-800 dark:text-gray-100 relative">
        <h2 className="text-xl font-bold mb-4">{ticket.title}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          تاریخ ارسال: {ticket.date}
        </p>
        <p className="leading-relaxed mb-6">{ticket.content}</p>

        {/* فرم پاسخ */}
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-sm font-semibold">
            پاسخ شما:
          </label>
          <textarea
            className="w-full h-24 p-2 rounded-lg bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-yellow-400 transition"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="متن پاسخ..."
          />
          <button
            type="submit"
            disabled={sending}
            className="mt-3 bg-orange-600 dark:bg-yellow-400 text-white dark:text-black px-4 py-2 rounded-md hover:bg-orange-700 dark:hover:bg-yellow-500 transition"
          >
            {sending ? "در حال ارسال..." : "ارسال پاسخ"}
          </button>
        </form>

        <button
          onClick={onClose}
          className="absolute top-2 left-2 text-red-500 hover:text-red-700"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
