"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function Messages({ gameNetName, gameNet, userName }) {
  const [messages, setMessages] = useState(null);
  useEffect(() => {
    // تابع دریافت پیام‌ها
    const fetchMessages = () => {
      fetch("/api/chat")
        .then((res) => res.json())
        .then((data) => setMessages(data.messages))
        .catch((err) => console.error(err));
    };
    fetchMessages();

    const intervalId = setInterval(fetchMessages, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      {gameNet === gameNetName ? (
        <div className="w-full h-[500px] flex flex-col-reverse gap-2 p-2 overflow-y-auto scroll-box">
          {messages?.map((message) => {
            if (
              message.senderModel === "Users" &&
              message.sender.userName === userName
            ) {
              return (
                <div
                  key={message._id}
                  className="self-start max-w-[70%] dark:bg-gold dark:text-black bg-rose-600 text-white rounded-xl p-2 flex flex-col"
                >
                  <Link
                    href={`/profile/${message.sender._id}`}
                    className="text-xs dark:text-gray-700 text-gray-300 self-start"
                  >
                    {message.sender.userName
                      ? message.sender.userName
                      : message.sender.gameNet}
                  </Link>
                  <p className="break-words"> {message.message} </p>
                  <span className="text-xs dark:text-gray-700 text-gray-300 self-start">
                    {new Date(message.createdAt).toLocaleString("fa-IR")}
                  </span>
                </div>
              );
            } else if (
              message.senderModel === "Admin" &&
              message.sender.gameNet === gameNetName
            ) {
              return (
                <div
                  key={message._id}
                  className="self-start max-w-[70%] dark:bg-gold dark:text-black bg-rose-600 text-white rounded-xl p-2 flex flex-col"
                >
                  <button className="text-xs dark:text-gray-700 text-gray-300 self-start">
                    {message.sender.userName
                      ? message.sender.userName
                      : message.sender.gameNet}
                  </button>
                  <p className="break-words"> {message.message} </p>
                  <span className="text-xs dark:text-gray-700 text-gray-300 self-start">
                    {new Date(message.createdAt).toLocaleString("fa-IR")}
                  </span>
                </div>
              );
            }
            return (
              <div
                key={message._id}
                className="self-end max-w-[70%] dark:bg-gray-800 dark:text-gray-300 bg-gray-300 text-black rounded-xl p-2 flex flex-col"
              >
                <Link
                  href={`/profile/${message.sender._id}`}
                  className="text-xs dark:text-gray-700 text-gray-500 self-start"
                >
                  {message.sender.userName
                    ? message.sender.userName
                    : message.sender.gameNet}
                </Link>
                <p className="break-words"> {message.message} </p>
                <span className="text-xs text-gray-500 self-end">
                  {" "}
                  {new Date(message.createdAt).toLocaleString("fa-IR")}{" "}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="w-full h-[500px] flex flex-col-reverse gap-2 p-2 overflow-y-auto scroll-box">
          {messages?.map((message) => {
            
            if (
              message.senderModel === "Users" &&
              message.sender.userName === userName
            ) {
              return (
                <div
                  key={message._id}
                  className="self-start max-w-[70%] dark:bg-gold dark:text-black bg-rose-600 text-white rounded-xl p-2 flex flex-col"
                >
                  <Link
                    href={`/profile/${message.sender._id}`}
                    className="text-xs dark:text-gray-700 text-gray-300 self-start"
                  >
                    {message.sender.userName
                      ? message.sender.userName
                      : message.sender.gameNet}
                  </Link>
                  <p className="break-words"> {message.message} </p>
                  <span className="text-xs dark:text-gray-700 text-gray-300 self-start">
                    {new Date(message.createdAt).toLocaleString("fa-IR")}
                  </span>
                </div>
              );
            } else if (
              message.senderModel === "Admin" &&
              message.sender.gameNet === gameNetName
            ) {
              return (
                <div
                  key={message._id}
                  className="self-start max-w-[70%] dark:bg-gold dark:text-black bg-rose-600 text-white rounded-xl p-2 flex flex-col"
                >
                  <button className="text-xs dark:text-gray-700 text-gray-300 self-start">
                    {message.sender.userName
                      ? message.sender.userName
                      : message.sender.gameNet}
                  </button>
                  <p className="break-words"> {message.message} </p>
                  <span className="text-xs dark:text-gray-700 text-gray-300 self-start">
                    {new Date(message.createdAt).toLocaleString("fa-IR")}
                  </span>
                </div>
              );
            }
            return (
              <div
                key={message._id}
                className="self-end max-w-[70%] dark:bg-gray-800 dark:text-gray-300 bg-gray-300 text-black rounded-xl p-2 flex flex-col"
              >
               
                <Link
                  href={`/profile/${message.sender._id}`}
                  className="text-xs dark:text-gray-700 text-gray-500 self-start"
                >
                  {message.sender.userName
                    ? `${message.sender.userName} - ${message.sender.gameNet}`
                    : message.sender.gameNet}
                </Link>
                <p className="break-words"> {message.message} </p>
                <span className="text-xs text-gray-500 self-end">
                  {" "}
                  {new Date(message.createdAt).toLocaleString("fa-IR")}{" "}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

export default Messages;
