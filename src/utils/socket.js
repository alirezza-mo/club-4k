"use client";

import { io } from "socket.io-client";

let socket = null;
let messageHandlers = new Set();

export const initSocket = (userId) => {
  if (!userId || typeof window === "undefined") return null;

  try {
    if (!socket) {
      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 
        (typeof window !== "undefined" && window.location.origin) || 
        "http://localhost:3000";

      socket = io(socketUrl, {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 3000,
        transports: ["websocket", "polling"]
      });

      socket.on("connect", () => {
        console.debug("Socket connected");
        socket.emit("register", userId);
      });

      socket.on("disconnect", () => {
        console.debug("Socket disconnected");
      });

      socket.on("error", (error) => {
        console.error("Socket error:", error);
      });

      socket.on("notification", (data) => {
        messageHandlers.forEach(handler => handler(data));
      });
    }

    return socket;
  } catch (err) {
    console.error("Socket initialization error:", err);
    return null;
  }
};

export const sendMessage = async (message, toUserId = "*") => {
  if (!socket || !socket.connected) {
    console.error("Socket not connected");
    return false;
  }

  try {
    socket.emit("notify", {
      toUserId,
      type: "new-message",
      data: message
    });
    return true;
  } catch (err) {
    console.error("Error sending message:", err);
    return false;
  }
};

export const onMessage = (handler) => {
  messageHandlers.add(handler);
  return () => messageHandlers.delete(handler);
};

export const getConnectionState = () => {
  if (!socket) return "closed";
  return socket.connected ? "connected" : "connecting";
};

export const closeConnection = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
  messageHandlers.clear();
};