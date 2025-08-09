"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
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
    const res = await fetch("api/chat" , {
      method : 'POST' ,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({message}),
    })
    res.status === 400 && swal({
        title: "اخطار",
        text: " بدون وارد کردن کاراکتر خاص",
        icon: "error",
        button: "باشد",
      })
      res.status === 404 && route.push("/register")
    res.status === 201 && setMessage("")
    setMessage("")
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
