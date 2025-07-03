// components/Admin/ChatRoomPage.tsx
"use client";
import { useState } from "react";

const ChatRoomPage = () => {
  const [activeTab, setActiveTab] = useState("global");

  return (
    <section className="p-6">
      <h2 className="text-xl font-bold mb-4 dark:text-gold">تالار گفتگو</h2>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("global")}
          className={`px-4 py-2 rounded-md ${
            activeTab === "global"
              ? "bg-orange-500 text-white dark:bg-yellow-500"
              : "bg-gray-200 text-gray-700 dark:bg-zinc-700 dark:text-white"
          }`}
        >
          گفتگوی گلوبال
        </button>
        <button
          onClick={() => setActiveTab("local")}
          className={`px-4 py-2 rounded-md ${
            activeTab === "local"
              ? "bg-orange-500 text-white dark:bg-yellow-500"
              : "bg-gray-200 text-gray-700 dark:bg-zinc-700 dark:text-white"
          }`}
        >
          گفتگوی لوکال
        </button>
      </div>

      <div className="border rounded-md h-[500px] overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-zinc-800">
          {/* لیست پیام‌ها اینجا */}
          <div className="text-sm text-gray-700 dark:text-gray-200 ">
            پیام‌های {activeTab === "global" ? "گلوبال" : "لوکال"} اینجا ظاهر می‌شوند...
          </div>
        </div>

        <form className="flex border-t p-4 bg-white dark:bg-zinc-800">
          <input
            type="text"
            className="flex-1 px-4 py-2 border rounded-md bg-white dark:bg-zinc-700 dark:text-white"
            placeholder="پیام خود را بنویسید..."
          />
          <button
            type="submit"
            className="ml-2 px-4 py-2 bg-orange-500 text-white rounded-md dark:bg-yellow-500"
          >
            ارسال
          </button>
        </form>
      </div>
    </section>
  );
};

export default ChatRoomPage;
