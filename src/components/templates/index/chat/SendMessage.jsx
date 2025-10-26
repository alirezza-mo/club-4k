"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { fetchWithRefresh } from "@/utils/getAccessToken";
import { sendMessage as socketSendMessage } from "@/utils/socket";
import swal from "sweetalert";

function SendMessage() {
  const route = useRouter()
  const [message, setMessage] = useState("");
  const handleSend = async () => {
    if(!message.trim()) {
      return swal({
        title: "اخطار",
        text: " بدون وارد کردن کاراکتر خاص ",
        icon: "error",
        button: "باشد",
      })
    }

    // Create optimistic update
    const optimisticMessage = {
      _id: Date.now().toString(), // temporary ID
      message: message.trim(),
      createdAt: new Date().toISOString(),
      sender: null, // will be populated after API response
      senderModel: "Users",
      isOptimistic: true // flag to identify optimistic updates
    };

    // Dispatch optimistic message immediately
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("chat:new-message", { detail: optimisticMessage }));
    }

    const res = await fetch("api/chat" , {
      method : 'POST' ,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({message}),
    })
    if (res.status === 400) {
      swal({
        title: "اخطار",
        text: " بدون وارد کردن کاراکتر خاص",
        icon: "error",
        button: "باشد",
      })
      return;
    }
    if (res.status === 404) {
      route.push("/register");
      return;
    }

    if (res.status === 201) {
      // Build a populated message client-side so Messages can display it immediately.
      try {
        const postData = await res.json().catch(() => null);
        const createdRaw = postData?.data || postData || null;

        try {
          const userRes = await fetchWithRefresh("/api/auth/me", { method: "GET" });
          if (userRes && userRes.ok) {
            const user = await userRes.json();
            const populated = createdRaw
              ? {
                  ...createdRaw,
                  sender: {
                    _id: user._id || user._id,
                    userName: user.userName || user.name,
                    gameNet: user.gameNet || undefined,
                    role: user.role || undefined,
                  },
                }
              : null;

            if (populated) {
              // ارسال پیام از طریق سوکت
              socketSendMessage(populated);

              // Fallback به DOM events
              if (typeof window !== "undefined") {
                if (process.env.NODE_ENV === 'development') console.debug('Dispatching chat:new-message (populated)', populated);
                window.dispatchEvent(new CustomEvent("chat:new-message", { detail: populated }));
                // اطمینان از بروزرسانی Messages در صورت نیاز
                if (process.env.NODE_ENV === 'development') console.debug('Dispatching chat:refresh (after POST)');
                window.dispatchEvent(new CustomEvent("chat:refresh"));
              }
            } else {
              // fallback: try a light GET for the latest populated message
              try {
                const latestRes = await fetch(`/api/chat?skip=0&limit=1`);
                if (latestRes && latestRes.ok) {
                  const latestData = await latestRes.json();
                  const created = Array.isArray(latestData?.messages) ? latestData.messages[0] : latestData?.data;
                  if (created && typeof window !== "undefined") {
                    if (process.env.NODE_ENV === 'development') console.debug('Dispatching chat:new-message (fetched latest)', created);
                    window.dispatchEvent(new CustomEvent("chat:new-message", { detail: created }));
                    if (process.env.NODE_ENV === 'development') console.debug('Dispatching chat:refresh (after fetching latest)');
                    window.dispatchEvent(new CustomEvent("chat:refresh"));
                  }
                }
              } catch (e) {
                // ignore
              }
            }
          }
        } catch (e) {
          // if we couldn't fetch user, fallback to GET latest
          try {
            const latestRes = await fetch(`/api/chat?skip=0&limit=1`);
            if (latestRes && latestRes.ok) {
              const latestData = await latestRes.json();
              const created = Array.isArray(latestData?.messages) ? latestData.messages[0] : latestData?.data;
              if (created && typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("chat:new-message", { detail: created }));
              }
            }
          } catch (e2) {
            // ignore
          }
        }
      } catch (err) {
        // ignore
      }

      setMessage("");
      return;
    }

    // fallback: clear input
    setMessage("");
  }
  return (
    <div className="w-full flex items-center gap-2">
      <textarea
        className="scroll-box flex-1 bg-transparent border border-gray-600 rounded-lg px-3 py-2 overflow-y-auto break-words text-sm focus:outline-none resize-none max-h-40"
        placeholder=" پیام خود را وارد نمایید ... "
        value={message}
        rows={1}
        onChange={(e) => {
          setMessage(e.target.value);
          // auto-resize
          e.target.style.height = "auto";
          e.target.style.height = `${e.target.scrollHeight}px`;
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // جلوگیری از ایجاد خط جدید
            handleSend(); // ارسال پیام
          }
        }}
      />
      <button
        onClick={handleSend}
        className="ml-2 text-white cursor-pointer px-4 py-2 bg-blue-600 rounded-lg text-sm hover:bg-blue-700"
      >
        ارسال
      </button>
    </div>
  );
}

export default SendMessage;
