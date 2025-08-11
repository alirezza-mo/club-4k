"use client";

import { fetchWithRefresh } from "@/utils/getAccessToken";
import { useEffect, useState } from "react";

export function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const res = await fetchWithRefresh("/api/auth/me");
      if (!res || !res.ok) {
        setLoading(false);
        return;
      }
      const data = await res.json();
      setUser(data);
      setLoading(false);
    };
    loadUser();
  }, []);

  return { user, loading };
}
