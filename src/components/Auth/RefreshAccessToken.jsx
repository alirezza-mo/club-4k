"use client";
import { useEffect } from "react";

export default function RefreshAccessToken({ intervalMs = 10 * 60 * 1000 }) {
  useEffect(() => {
    let mounted = true;

    async function refresh() {
      try {
        const res = await fetch("/api/auth/refresh-token", {
          method: "POST",
          credentials: "include",
        });
        if (!mounted) return;
        if (!res.ok) {
          // if refresh failed, we don't throw here; allow layouts/pages to handle sign-in
          console.warn("Refresh token failed", res.status);
        } else {
          console.debug("Access token refreshed");
        }
      } catch (err) {
        console.error("Error refreshing token:", err);
      }
    }

    // initial attempt
    refresh();

    // periodic refresh
    const id = setInterval(() => {
      refresh();
    }, intervalMs);

    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [intervalMs]);

  return null;
}
