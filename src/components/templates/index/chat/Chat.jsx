"use client";
import React, { useEffect, useState } from "react";
import SendMessage from "./SendMessage";
import Messages from "./Messages";
import { fetchWithRefresh } from "@/utils/getAccessToken";

function Chat() {
  const [gameNet, setGameNet] = useState("global"); // پیش‌فرض global باشه
  const [gameNetName, setGameNetName] = useState("");
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState(""); // "Admin" یا "Users"
  const [isLoading, setIsLoading] = useState(true); // حالت لودینگ اضافه شد

  useEffect(() => {
    fetchWithRefresh("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        setGameNetName(data?.gameNet || "");
        setUserName(data?.userName || "");
        setRole(data?.role || "Users"); // فرض می‌کنیم سرور role میده
        // اگر ادمین هست، حالت گلوبال انتخاب بشه
        if (data?.role === "Admin") {
          setGameNet("global");
        } else {
          setGameNet(data?.gameNet || "global");
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false)); // لودینگ بعد از اتمام غیرفعال بشه
  }, []);

  // فقط وقتی داده‌ها آماده باشن رندر کن
  if (isLoading) {
    return <div className="text-center text-gray-600">در حال بارگذاری...</div>;
  }

  return (
    <section className="w-full flex flex-col items-center mt-20">
      <h4 className="self-start text-xl sm:text-2xl dark:text-white font-bold flex items-center gap-2 border-b-4 dark:border-gold border-orange-600 pb-2">
        تالار گفتگو
      </h4>
      <div className="m-5 flex items-center justify-center gap-3">
        {gameNetName && (
          <button
            onClick={(e) => setGameNet(e.target.value)}
            value={gameNetName}
            className={`px-8 py-2 rounded-2xl cursor-pointer ${
              gameNet === gameNetName
                ? "bg-orange-600 text-white dark:bg-gold dark:text-black"
                : "bg-gray-300 text-orange-600 dark:text-gold dark:bg-black"
            } hover:bg-orange-600 hover:text-white transition-all dark:hover:bg-gold dark:hover:text-black`}
          >
            {gameNetName}
          </button>
        )}
        <button
          onClick={(e) => setGameNet(e.target.value)}
          value="global"
          className={`px-8 py-2 rounded-2xl cursor-pointer ${
            gameNet === "global"
              ? "bg-orange-600 text-white dark:bg-gold dark:text-black"
              : "bg-gray-300 text-orange-600 dark:text-gold dark:bg-black"
          } hover:bg-orange-600 hover:text-white transition-all dark:hover:bg-gold dark:hover:text-black`}
        >
          گلوبال
        </button>
      </div>
      <div className="w-full rounded-2xl bg-white dark:bg-black my-5 p-2">
        <Messages
          gameNetName={gameNetName}
          gameNet={gameNet}
          userName={userName}
          role={role}
        />
        <SendMessage />
      </div>
    </section>
  );
}

export default Chat;