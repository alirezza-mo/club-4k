"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import swal from "sweetalert";

function SendMessage() {
  const route = useRouter()
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    const trimmedMessage = message.trim();
    
    if (!trimmedMessage) {
      return swal({
        title: "اخطار",
        text: "لطفاً پیامی وارد کنید",
        icon: "error",
        button: "باشد",
      });
    }

    if (isSending) return; // Prevent double sending
    setIsSending(true);

    try {
      // Clear input immediately for better UX
      setMessage("");

        const res = await fetch("/api/chat", {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmedMessage }),
      });

      if (!res.ok) {
        if (res.status === 400) {
          swal({
            title: "اخطار",
            text: "لطفاً پیام معتبر وارد کنید",
            icon: "error",
            button: "باشد",
          });
        } else if (res.status === 401 || res.status === 403) {
          route.push("/login");
        } else if (res.status === 404) {
          route.push("/register");
        } else {
          throw new Error("Failed to send message");
        }
        return;
      }

      // Message sent successfully - Pusher will handle the real-time update
      // No need for complex client-side handling

    } catch (error) {
      console.error("Error sending message:", error);
      swal({
        title: "خطا",
        text: "ارسال پیام با خطا مواجه شد",
        icon: "error",
        button: "باشه",
      });
    } finally {
      setIsSending(false);
    }
  }
  return (
    <div className="w-full flex items-center gap-2">
      <textarea
        className="scroll-box flex-1 bg-transparent border border-gray-600 rounded-lg px-3 py-2 overflow-y-auto break-words text-sm focus:outline-none resize-none max-h-40 disabled:opacity-50"
        placeholder=" پیام خود را وارد نمایید ... "
        value={message}
        rows={1}
        disabled={isSending}
        onChange={(e) => {
          setMessage(e.target.value);
          // auto-resize
          e.target.style.height = "auto";
          e.target.style.height = `${e.target.scrollHeight}px`;
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !isSending) {
            e.preventDefault();
            handleSend();
          }
        }}
      />
      <button
        onClick={handleSend}
        disabled={isSending}
        className="ml-2 text-white cursor-pointer px-4 py-2 bg-blue-600 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSending ? "..." : "ارسال"}
      </button>
    </div>
  );
}

export default SendMessage;
