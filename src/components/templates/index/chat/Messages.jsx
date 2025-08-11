"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

function Messages({ gameNetName, gameNet, userName, role }) {
  const [messages, setMessages] = useState([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  const fetchMessages = async (append = false) => {
    if (!hasMore || loading) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/chat?skip=${skip}&limit=20`);
      const data = await res.json();

      if (data.messages.length < 20) setHasMore(false);

      setMessages((prev) => {
        const existingIds = new Set(prev.map((m) => m._id));
        const newMessages = data.messages.filter((m) => !existingIds.has(m._id));
        return append ? [...newMessages, ...prev] : [...prev, ...newMessages];
      });

      setSkip((prev) => prev + data.messages.length);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages(false);
  }, []);

  const handleScroll = () => {
    if (!containerRef.current) return;
    if (containerRef.current.scrollTop === 0) {
      const oldHeight = containerRef.current.scrollHeight;
      fetchMessages(true).then(() => {
        requestAnimationFrame(() => {
          if (containerRef.current) {
            containerRef.current.scrollTop =
              containerRef.current.scrollHeight - oldHeight;
          }
        });
      });
    }
  };

  const filteredMessages = messages.filter((msg) => {
    if (gameNet === "global") return true;
    if (msg.senderModel === "Admin" && msg.sender?.gameNet === gameNetName) return true;

    return msg.sender?.gameNet === gameNet;
  });

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="w-full h-[500px] flex flex-col-reverse gap-2 p-2 overflow-y-auto scroll-box"
    >
      {loading && (
        <div className="text-center text-gray-600">در حال بارگذاری...</div>
      )}

      {filteredMessages.map((message, index) => {
        // پیام خود فرد (کاربر یا ادمین) باید همیشه استایل خاص داشته باشد
        let isSelf = false;
        if (message.senderModel === "Users" && message.sender?.userName === userName) {
          isSelf = true;
        }
        if (message.senderModel === "Admin" && role === "Admin" && message.sender?.gameNet === gameNetName) {
          isSelf = true;
        }

        let senderInfo = "";
        if (message.senderModel === "Users") {
          senderInfo = message.sender?.userName
            ? `${message.sender.userName}${message.sender.gameNet ? ` - ${message.sender.gameNet}` : ""}`
            : "کاربر ناشناس";
        } else if (message.senderModel === "Admin") {
          senderInfo = message.sender?.gameNet
            ? `ادمین ${message.sender.gameNet}`
            : "ادمین ناشناس";
        }
        let dateInfo = "";
        if (message.createdAt) {
          try {
            dateInfo = new Date(message.createdAt).toLocaleString("fa-IR");
          } catch {
            dateInfo = "زمان نامعتبر";
          }
        } else {
          dateInfo = "زمان نامشخص";
        }

        return (
          <div
            key={message._id ? `${message._id}-${index}` : index}
            className={`max-w-[70%] rounded-xl p-2 flex flex-col ${
              isSelf
                ? "self-start dark:bg-gold dark:text-black bg-rose-600 text-white"
                : "self-end dark:bg-gray-800 dark:text-white  bg-gray-300 text-black"
            }`}
          >
            {message.senderModel === "Users" ? (
              <Link
                href={`/profile/${message.sender?._id || "#"}`}
                className="text-xs text-gray-400 self-start"
              >
                {senderInfo}
              </Link>
            ) : (
              <span className="text-xs text-gray-400 self-start">
                {senderInfo}
              </span>
            )}

            <p className="break-words">{message.message}</p>

            <span className="text-xs text-gray-400 self-start">
              {dateInfo}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default Messages;
