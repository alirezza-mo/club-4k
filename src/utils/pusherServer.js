import Pusher from "pusher";

const appId = process.env.PUSHER_APP_ID || "";
const key = process.env.PUSHER_KEY || "";
const secret = process.env.PUSHER_SECRET || "";
const cluster = process.env.PUSHER_CLUSTER || "eu";

let pusherInstance;

export function getPusher() {
  if (!pusherInstance) {
    // Validate required env vars
    if (!appId || !key || !secret) {
      console.warn("Pusher credentials missing - realtime features will not work");
    }
    
    pusherInstance = new Pusher({
      appId,
      key,
      secret,
      cluster,
      useTLS: true,
    });
  }
  return pusherInstance;
}

export async function triggerEvent(channel, event, payload) {
  // Early return if credentials are missing
  if (!appId || !key || !secret) {
    console.warn("Pusher credentials missing, skipping trigger");
    return false;
  }
  
  const p = getPusher();
  try {
    await p.trigger(channel, event, payload);
    return true;
  } catch (err) {
    console.error("Pusher trigger error:", err?.message || err);
    return false;
  }
}


