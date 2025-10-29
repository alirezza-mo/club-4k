"use client";

import Pusher from "pusher-js";

let pusherInstance = null;

export function getPusherClient() {
  if (typeof window === "undefined") return null;
  if (!pusherInstance) {
    const key = process.env.NEXT_PUBLIC_PUSHER_KEY || "";
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "eu";
    if (!key) {
      console.warn("Pusher key not found, realtime features will not work");
      return null;
    }
    pusherInstance = new Pusher(key, { 
      cluster, 
      forceTLS: true,
      // Disable stats to reduce connection overhead
      enableStats: false 
    });
  }
  return pusherInstance;
}

export function subscribe(channelName, eventName, handler) {
  const client = getPusherClient();
  if (!client) return () => {};
  
  try {
    const channel = client.subscribe(channelName);
    channel.bind(eventName, handler);
    
    // Return cleanup function
    return () => {
      try {
        channel.unbind(eventName, handler);
        client.unsubscribe(channelName);
      } catch (err) {
        console.error("Error cleaning up Pusher subscription:", err);
      }
    };
  } catch (err) {
    console.error("Error subscribing to Pusher channel:", err);
    return () => {};
  }
}

export function disconnect() {
  if (pusherInstance) {
    try {
      pusherInstance.disconnect();
      pusherInstance = null;
    } catch (err) {
      console.error("Error disconnecting Pusher:", err);
    }
  }
}


