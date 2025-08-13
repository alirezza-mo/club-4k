"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useRouter } from "next/navigation";
import { fetchWithRefresh } from "@/utils/getAccessToken";

export default function ScanSessionPage() {
  const router = useRouter();
  const scannerRef = useRef(null);
  const qrInstanceRef = useRef(null);
  const isRunningRef = useRef(false);
  const isMountedRef = useRef(false);

  const [message, setMessage] = useState("");
  const [state, setState] = useState(null);
  const [role, setRole] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [manualBarcode, setManualBarcode] = useState("");

  const lastScanRef = useRef({ value: null, at: 0 });

  // Start scanner
  const startScanner = async () => {
    try {
      if (isRunningRef.current) return;

      const readerEl = document.getElementById("reader");
      if (!readerEl) {
        setMessage("عنصر اسکنر پیدا نشد");
        return;
      }

      // جلوگیری از دوبار mount در StrictMode
      if (!isMountedRef.current) {
        isMountedRef.current = true;
      } else {
        return;
      }

      // ساخت نمونه اسکنر فقط یکبار
      if (!qrInstanceRef.current) {
        qrInstanceRef.current = new Html5Qrcode("reader", { verbose: false });
      }

      await qrInstanceRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: 280,
          disableFlip: true,
          disableBeep: true, // غیرفعال کردن beep
        },
        async (decodedText) => {
          await onScan(decodedText);
        },
        (err) => {
          console.debug("Scan error:", err);
        }
      );

      // مکث کوتاه تا video کامل آماده شود
      await new Promise((res) => setTimeout(res, 300));

      isRunningRef.current = true;
      setIsScanning(true);
    } catch (err) {
      console.error("Scanner start error:", err);
      setMessage("دسترسی به دوربین یا شروع اسکن ممکن نشد");
      setIsScanning(false);
      isRunningRef.current = false;
    }
  };

  // Stop scanner
  const stopScanner = async () => {
    try {
      if (qrInstanceRef.current && isRunningRef.current) {
        await new Promise((res) => setTimeout(res, 100)); // مکث کوتاه
        try {
          await qrInstanceRef.current.stop();
        } catch (e) {}
        try {
          await qrInstanceRef.current.clear();
        } catch (e) {}
      }
    } finally {
      setIsScanning(false);
      isRunningRef.current = false;
    }
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isScanning) stopScanner();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // ❌ stopScanner اینجا فراخوانی نمیشه تا دوربین خاموش نشه
    };
  }, [isScanning]);

  const onScan = async (barcode) => {
    const now = Date.now();
    if (
      lastScanRef.current.value === barcode &&
      now - lastScanRef.current.at < 2000
    )
      return;
    lastScanRef.current = { value: barcode, at: now };

    try {
      const res = await fetchWithRefresh("/api/sessions/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barcode }),
      });

      if (!res || !res.ok) {
        if (res?.status === 401) {
          router.push(`/login?returnUrl=/scan-session`);
          return;
        }
        const e = await res.json().catch(() => ({}));
        setMessage(e?.message || "خطا در اسکن");
        return;
      }

      const data = await res.json();
      setState(data.state);
      setRole(data.role);
      setMessage(data.message);
    } catch (err) {
      setMessage("بروز خطا هنگام پردازش اسکن");
    }
  };

  const onManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualBarcode) return;
    await onScan(manualBarcode);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-900 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/60 backdrop-blur p-6 md:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white text-center">
            اسکن بارکد کنسول
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-center mt-2">
            برای شروع یا پایان جلسه، بارکد روی کنسول را اسکن کنید.
          </p>

          <div className="mt-6 flex flex-col items-center">
            <div className="w-full max-w-md aspect-square rounded-xl border-2 border-dashed border-emerald-400/70 dark:border-emerald-500/60 bg-emerald-50/40 dark:bg-emerald-900/10 flex items-center justify-center overflow-hidden">
              <div id="reader" ref={scannerRef} className="w-full h-full" />
            </div>

            <div className="mt-4 flex gap-3">
              {!isScanning && (
                <button
                  onClick={() => setShowPermissionModal(true)}
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-[0_10px_30px_rgba(16,185,129,0.5)]"
                >
                  شروع اسکن
                </button>
              )}

              {isScanning && (
                <button
                  onClick={stopScanner}
                  className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold"
                >
                  توقف اسکن
                </button>
              )}
            </div>

            <form
              onSubmit={onManualSubmit}
              className="mt-5 w-full max-w-md flex items-center gap-2"
            >
              <input
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
                placeholder="ورود دستی بارکد"
                className="flex-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                ارسال
              </button>
            </form>

            {message && (
              <div className="mt-5 w-full max-w-md rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-3 text-center">
                {message}
              </div>
            )}

            {state === "active" && (
              <div className="mt-4 w-full max-w-md rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 p-3 text-center">
                جلسه فعال است {role && <span> - نقش شما: بازیکن {role}</span>}
              </div>
            )}
          </div>

          <div className="mt-8">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
              نکات و مقررات
            </h2>
            <ul className="mt-3 list-disc pr-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>
                برای شروع، ابتدا کاربر اول اسکن کند؛ سپس کاربر دوم. برای پایان،
                دوباره به همین ترتیب.
              </li>
              <li>
                در طول جلسه این کنسول برای دیگران قفل است تا پایان کامل جلسه.
              </li>
              <li>
                برای اسکن موفق، بارکد را در کادر مشخص ثابت نگه دارید و از نور
                کافی استفاده کنید.
              </li>
              <li>
                اگر دوربین در دسترس نبود، می‌توانید بارکد را به صورت دستی وارد
                کنید.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {showPermissionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-[90%] max-w-md rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              اجازه دسترسی به دوربین
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-5">
              برای اسکن بارکد کنسول، اجازه دسترسی به دوربین لازم است. آیا اجازه
              می‌دهید؟
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowPermissionModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-100"
              >
                خیر
              </button>
              <button
                onClick={async () => {
                  setShowPermissionModal(false);
                  await startScanner();
                }}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                بله، شروع اسکن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
