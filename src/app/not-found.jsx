"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-black text-gray-100 px-4">
      <div className="max-w-4xl w-full flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <section className="flex-1 text-center md:text-right">
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-yellow-300 to-white">
            404
          </h1>
          <h2 className="mt-4 text-2xl md:text-3xl font-bold">صفحه مورد نظر پیدا نشد</h2>
          <p className="mt-3 text-gray-300 leading-relaxed">
            احتمالاً لینک اشتباه است یا صفحه حذف شده. نگران نباشید — ما همیشه اینجا هستیم تا کمکتان کنیم.
          </p>

          <div className="mt-6 flex items-center justify-center md:justify-start gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-gold text-black font-semibold px-5 py-3 rounded-lg shadow-lg hover:scale-105 transition-transform"
            >
              برگشت به صفحه اصلی
            </Link>

            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 border border-gray-700 text-gray-200 px-4 py-3 rounded-lg hover:bg-gray-800 transition"
            >
              بازگشت
            </button>
          </div>

          <div className="mt-6 text-sm text-gray-400">
            <p>یا از نوار ناوبری استفاده کنید تا سریعتر به مقصد برسید.</p>
          </div>
        </section>

        <aside className="flex-1 flex items-center justify-center">
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            <svg
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <defs>
                <linearGradient id="g1" x1="0%" x2="100%">
                  <stop offset="0%" stopColor="#FFD166" />
                  <stop offset="50%" stopColor="#06D6A0" />
                  <stop offset="100%" stopColor="#118AB2" />
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="200" height="200" rx="20" fill="#0f172a" />
              <g transform="translate(36,36)">
                <circle cx="64" cy="40" r="34" fill="url(#g1)" className="animate-pulse-slow" />
                <g transform="translate(20,70)">
                  <rect x="0" y="0" width="90" height="10" rx="3" fill="#10233b" />
                  <rect x="0" y="18" width="70" height="8" rx="3" fill="#0b1220" />
                </g>
              </g>
            </svg>
          </div>
        </aside>
      </div>
    </main>
  );
}
