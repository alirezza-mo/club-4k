"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { subscribe } from "@/utils/pusherClient";

// تابع debounce برای بهینه‌سازی اسکرول
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

function Messages({ gameNetName, gameNet, userName, role }) {
  const [messages, setMessages] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cachedMessages')) || [];
    } catch {
      return [];
    }
  });
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const containerRef = useRef(null);
  const initialLoadDone = useRef(false);
  const PAGE_SIZE = 50; // تعداد پیام‌ها در هر صفحه

  // کش کردن پیام‌ها
  const cacheMessages = useCallback((msgs) => {
    try {
      localStorage.setItem('cachedMessages', JSON.stringify(msgs.slice(-50)));
    } catch (err) {
      console.error('Error caching messages:', err);
    }
  }, []);
  
  // Memoize filtered messages
  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      if (!gameNetName && gameNet === "global") return true;
      if (gameNet === "global") return true;
      if (msg.senderModel === "Admin" && msg.sender?.gameNet === gameNetName) return true;
      return msg.sender?.gameNet === gameNet;
    });
  }, [messages, gameNetName, gameNet]);

  const handleNewMessage = useCallback((msg) => {
    if (!msg || !initialLoadDone.current) return;

    setMessages((prev) => {
      // اگر پیام جدید populated است و پیام موقت مشابهی داریم، پیام موقت را حذف کنیم
      const isUpdatingOptimistic = !msg.isOptimistic && prev.some(m => 
        m.isOptimistic && m.message === msg.message
      );

      let messages = isUpdatingOptimistic
        ? prev.filter(m => !(m.isOptimistic && m.message === msg.message))
        : prev;

      // بررسی تکراری نبودن پیام
      const existingIndex = messages.findIndex(m => m._id === msg._id);
      if (existingIndex !== -1) return prev;

      if (process.env.NODE_ENV === 'development') {
        console.debug('Received chat:new-message', msg, isUpdatingOptimistic ? '(replacing optimistic)' : '');
      }
      
      // اضافه کردن پیام جدید، محدود کردن تعداد و مرتب‌سازی
      const newMessages = [...messages, msg]
        .slice(-200) // محدود کردن به 200 پیام
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // کش کردن پیام‌ها
      cacheMessages(newMessages);

      // اسکرول به پایین فقط برای پیام‌های جدید
      if (msg.isOptimistic || isUpdatingOptimistic) {
        scrollToBottom();
      }

      return newMessages;
    });

    if (!msg.isOptimistic) {
      setSkip((prev) => prev + 1);
    }
  }, []);

  const fetchMessages = useCallback(async (append = false) => {
    if (!hasMore || (append && isLoadingMore) || (!append && loading)) return;
    
    if (append) {
      setIsLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const res = await fetch(`/api/chat?skip=${skip}&limit=${PAGE_SIZE}`);
      const data = await res.json();

      if (data.messages.length < PAGE_SIZE) {
        setHasMore(false);
      }

      setMessages((prev) => {
        const existingIds = new Set(prev.map((m) => m._id));
        const newMessages = data.messages.filter((m) => !existingIds.has(m._id));
        let combined;
        
        if (append) {
          // برای پیام‌های قدیمی‌تر، به انتها اضافه می‌کنیم
          combined = [...prev, ...newMessages];
        } else {
          // برای پیام‌های جدید، به ابتدا اضافه می‌کنیم
          combined = [...newMessages, ...prev];
        }

        // مرتب‌سازی معکوس - پیام‌های جدیدتر در پایین
        const sorted = combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // فقط پیام‌های جدید را در localStorage ذخیره می‌کنیم
        if (!append) {
          cacheMessages(sorted.slice(0, PAGE_SIZE));
        }
        
        return sorted;
      });

      if (!append) {
        initialLoadDone.current = true;
      }

      setSkip((prev) => prev + data.messages.length);

      // اسکرول به آخرین پیام در اولین بارگذاری
      if (!append) {
        // استفاده از تایمر برای اطمینان از رندر شدن پیام‌ها
        setTimeout(() => {
          scrollToBottom(true);
        }, 100);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (append) {
        setIsLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  }, [hasMore, loading, isLoadingMore, skip, PAGE_SIZE]);

  const scrollToBottom = useCallback((force = false) => {
    if (!containerRef.current) return;
    
    try {
      const { scrollHeight, clientHeight, scrollTop } = containerRef.current;
      const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 100;
      
      if (force || isNearBottom) {
        requestAnimationFrame(() => {
          if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
          }
        });
      }
    } catch (err) {
      console.error('Error in scrollToBottom:', err);
    }
  }, []);

  useEffect(() => {
    fetchMessages(false);

    // Pusher subscription for new chat messages
    let unsub = null;
    try {
      unsub = subscribe("chat-global", "new-message", (msg) => {
        handleNewMessage(msg);
      });
      setIsConnected(true);
    } catch (e) {
      setIsConnected(false);
    }

    return () => {
      try { unsub && unsub(); } catch {}
    };
  }, [userName]);

  // Listen for local new-message events (dispatched by SendMessage) to update UI immediately
  // Refresh handler: fetch latest messages (skip=0) and merge to state.
  async function handleRefresh() {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/chat?skip=0&limit=50`);
      if (!res.ok) return;
      const data = await res.json();
      const fetched = data.messages || [];

      setMessages((prev) => {
        const existingIds = new Set(prev.map((m) => m._id));
        const newMessages = fetched.filter((m) => !existingIds.has(m._id));
      if (process.env.NODE_ENV === 'development') console.debug('chat:refresh fetched', fetched);
        return [...prev, ...newMessages];
      });

      setSkip((prev) => prev + fetched.length);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      // DOM event listeners for local events
      const domEventHandler = (e) => handleNewMessage(e?.detail);
      window.addEventListener("chat:new-message", domEventHandler);
      window.addEventListener("chat:refresh", handleRefresh);

      return () => {
        window.removeEventListener("chat:new-message", domEventHandler);
        window.removeEventListener("chat:refresh", handleRefresh);
      };
    }
  }, [handleNewMessage, handleRefresh]);


  // اسکرول هندلر با بهینه‌سازی
  const handleScroll = useCallback(
    debounce(() => {
      if (!containerRef.current || loading || isLoadingMore || !hasMore) return;
      
      try {
        const { scrollTop, scrollHeight } = containerRef.current;
        // وقتی کاربر به بالای صفحه نزدیک می‌شود (100 پیکسل مانده به بالا)
        if (scrollTop <= 100) {
          const oldHeight = scrollHeight;
          setIsLoadingMore(true);
          
          fetchMessages(true).then(() => {
            requestAnimationFrame(() => {
              if (containerRef.current) {
                const newScrollTop = containerRef.current.scrollHeight - oldHeight;
                if (newScrollTop > 0) {
                  containerRef.current.scrollTop = newScrollTop;
                }
              }
            });
          }).finally(() => {
            setIsLoadingMore(false);
          });
        }
      } catch (err) {
        console.error('Error in scroll handler:', err);
        setIsLoadingMore(false);
      }
    }, 150),
    [loading, isLoadingMore, hasMore, fetchMessages]
  );

  // Memoize filtered messages for better performance
  const memoizedMessages = useMemo(() => {
    return messages.filter((msg) => {
      if (!gameNetName && gameNet === "global") return true;
      if (gameNet === "global") return true;
      if (msg.senderModel === "Admin" && msg.sender?.gameNet === gameNetName) return true;
      return msg.sender?.gameNet === gameNet;
    });
  }, [messages, gameNetName, gameNet]);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="w-full h-[500px] flex flex-col-reverse gap-2 p-2 overflow-y-auto scroll-box"
    >
      {!isConnected && (
        <div className="text-center text-yellow-600 bg-yellow-100 p-1 rounded mb-2">
          قطع اتصال از سرور... در حال تلاش مجدد
        </div>
      )}
      {(loading || isLoadingMore) && (
        <div className="text-center text-gray-600 py-2">
          در حال بارگذاری پیام‌ها...
        </div>
      )}

      {filteredMessages.map((message, index) => {
        let isSelf = false;
        // برای پیام‌های موقت، همیشه متعلق به کاربر فعلی هستند
        if (message?.isOptimistic) {
          isSelf = true;
        }
        // برای پیام‌های عادی کاربران
        else if (message?.senderModel === "Users" && message?.sender?.userName === userName) {
          isSelf = true;
        }
        // برای پیام‌های ادمین
        else if (message?.senderModel === "Admin" && role === "Admin" && message?.sender?.gameNet === gameNetName) {
          isSelf = true;
        }

        let senderInfo = "";
        // برای پیام‌های موقت
        if (message?.isOptimistic) {
          senderInfo = "در حال ارسال...";
        }
        // برای پیام‌های عادی کاربران
        else if (message?.senderModel === "Users") {
          senderInfo = message.sender?.userName
            ? `${message.sender.userName}${message.sender?.gameNet ? ` - ${message.sender?.gameNet}` : ""}`
            : "کاربر ناشناس";
        }
        // برای پیام‌های ادمین
        else if (message?.senderModel === "Admin") {
          senderInfo = message.sender?.gameNet
            ? `ادمین ${message.sender?.gameNet}`
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