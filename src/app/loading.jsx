"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function GameNetLoading() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center space-y-6">
      <div className="animate-pulse">
        <Image
          src="/images/loading.jpg"
          alt="GameNet Logo"
          width={160}
          height={160}
          className="rounded-full shadow-[0_0_40px_10px_rgba(255,215,0,0.4)]"
        />
      </div>

      <div className="text-yellow-400 text-xl font-bold tracking-wide animate-pulse">
        در حال ورود به دنیای 4K
      </div>

      <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-purple-600 rounded-full animate-pulse shadow-lg" />
    </div>
  );
}

