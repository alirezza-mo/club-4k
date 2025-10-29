"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useRouter } from "next/navigation";
import { fetchWithRefresh, getCurrentUserId } from "@/utils/getAccessToken";
import Swal from "sweetalert";

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
  const [timer, setTimer] = useState(0);
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [pendingResult, setPendingResult] = useState(null);
  const [p1GoalsInput, setP1GoalsInput] = useState(0);
  const [p2GoalsInput, setP2GoalsInput] = useState(0);
  const [lastSession, setLastSession] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  const lastScanRef = useRef({ value: null, at: 0 });

  // گرفتن userId کاربر فعلی و تنظیم Pusher برای اعلان‌ها
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userId = await getCurrentUserId();
        setCurrentUserId(userId);
      } catch (err) {
        console.error("Error fetching userId:", err);
        Swal({
          title: "خطا",
          text: "لطفاً وارد حساب کاربری خود شوید",
          icon: "error",
          button: "باشه",
        });
        router.push(`/login?returnUrl=/scan-session`);
      }
    };
    fetchUserId();
    
    let unsubscribe1 = null;
    let unsubscribe2 = null;
    
    const setupRealtime = async () => {
      if (!currentUserId) return;
      try {
        const { subscribe } = await import("@/utils/pusherClient");
        unsubscribe1 = subscribe(`user-${currentUserId}`, 'pending-result', () => {
          Swal({
            title: "درخواست تایید نتیجه",
            text: "رقیب شما یک نتیجه ثبت کرده است. برای تائید وارد صفحه اسکن شوید.",
            icon: "info",
            button: "باشه",
          });
        });
        unsubscribe2 = subscribe(`user-${currentUserId}`, 'result-confirmed', () => {
          Swal({
            title: "نتیجه تایید شد",
            text: "نتیجه بازی شما تایید و امتیازات اعمال شد.",
            icon: "success",
            button: "باشه",
          });
        });
      } catch (err) {
        console.warn("Pusher client not available", err?.message || err);
      }
    };

    // Setup Pusher when userId is available
    const pusherInterval = setInterval(() => {
      if (currentUserId) {
        setupRealtime();
        clearInterval(pusherInterval);
      }
    }, 300);

    return () => {
      clearInterval(pusherInterval);
      try {
        unsubscribe1 && unsubscribe1();
      } catch (e) {}
      try {
        unsubscribe2 && unsubscribe2();
      } catch (e) {}
    };
  }, [router, currentUserId]);

  // Start scanner
  const startScanner = async () => {
    try {
      // Don't start if already running
      if (isRunningRef.current) {
        return;
      }

      const readerEl = document.getElementById("reader");
      if (!readerEl) {
        Swal({
          title: "خطا",
          text: "عنصر اسکنر پیدا نشد",
          icon: "error",
          button: "باشه",
        });
        return;
      }

      // Create new scanner instance if needed
      if (!qrInstanceRef.current) {
        qrInstanceRef.current = new Html5Qrcode("reader", { verbose: false });
      }

      // Check if already scanning
      try {
        const isScanning = qrInstanceRef.current.isScanning && qrInstanceRef.current.isScanning();
        if (isScanning) {
          console.log("Scanner already running");
          setIsScanning(true);
          return;
        }
      } catch (e) {
        // Continue if can't check
      }

      await qrInstanceRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 280, height: 280 },
          disableFlip: false,
          videoConstraints: {
            facingMode: "environment"
          }
        },
        async (decodedText) => {
          console.log("Scanned:", decodedText);
          await onScan(decodedText);
        },
        (err) => {
          // Only log if not a regular "not found" error
          if (!err.includes("Not Found")) {
            console.debug("Scan error:", err);
          }
        }
      );

      isRunningRef.current = true;
      setIsScanning(true);
    } catch (err) {
      console.error("Scanner start error:", err);
      Swal({
        title: "خطا",
        text: "دسترسی به دوربین یا شروع اسکن ممکن نشد",
        icon: "error",
        button: "باشه",
      });
      setIsScanning(false);
      isRunningRef.current = false;
      isMountedRef.current = false;
      qrInstanceRef.current = null;
    }
  };

  // Stop scanner
  const stopScanner = async () => {
    if (!qrInstanceRef.current || !isRunningRef.current) {
      setIsScanning(false);
      isRunningRef.current = false;
      return;
    }

    try {
      // Html5Qrcode stop() returns a Promise that resolves when camera is released
      await qrInstanceRef.current.stop();
    } catch (e) {
      console.error("Error stopping scanner:", e);
    }

    try {
      // Don't call clear if stop was successful
      // clear() should only be called if we want to completely reset the instance
      // which we don't need to do here
    } catch (e) {
      // Ignore
    }

    // Reset state
    isRunningRef.current = false;
    setIsScanning(false);
  };

  // Real-time timer for active session
  useEffect(() => {
    let interval;
    if (
      state === "active" &&
      currentUserId &&
      (player1 === currentUserId || player2 === currentUserId)
    ) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state, currentUserId, player1, player2]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (qrInstanceRef.current && isRunningRef.current) {
        stopScanner();
      }
    };
  }, []);

  const onScan = async (barcode) => {
    if (!currentUserId) {
      Swal({
        title: "خطا",
        text: "لطفاً وارد حساب کاربری خود شوید",
        icon: "error",
        button: "باشه",
      });
      router.push(`/login?returnUrl=/scan-session`);
      return;
    }

    console.log("Sending barcode to API:", barcode);
    
    // Parse barcode if it's a JSON object string
    let actualBarcode = barcode;
    try {
      const parsed = JSON.parse(barcode);
      if (parsed && parsed.barcode) {
        actualBarcode = parsed.barcode;
        console.log("Extracted barcode from JSON:", actualBarcode);
      }
    } catch (e) {
      // Not JSON, use as is
      console.log("Barcode is not JSON, using as is:", actualBarcode);
    }
    
    const now = Date.now();
    if (
      lastScanRef.current.value === actualBarcode &&
      now - lastScanRef.current.at < 2000
    )
      return;
    lastScanRef.current = { value: actualBarcode, at: now };

    try {
      const res = await fetchWithRefresh(
        state === "active" || state === "pendingEnd" // تغییر برای پایان جلسه
          ? "/api/sessions/end-scan"
          : "/api/sessions/scan",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ barcode: actualBarcode, userId: currentUserId }),
          credentials: "include",
        }
      );

      console.log("API response status:", res.status);
      if (!res || !res.ok) {
        if (res?.status === 401) {
          Swal({
            title: "خطا",
            text: "لطفاً وارد حساب کاربری خود شوید",
            icon: "error",
            button: "باشه",
          });
          router.push(`/login?returnUrl=/scan-session`);
          return;
        }
        const e = await res.json().catch(() => ({}));
        console.log("Full error object:", e);
        console.log("API error details:", e.message || e);
        if (e.message === "شما قبلاً به عنوان بازیکن اول اسکن کرده‌اید") {
          Swal({
            title: "هشدار",
            text: e.message,
            icon: "warning",
            button: "باشه",
          });
        } else if (e.message === "جلسه در وضعیت نامعتبر است یا پایان یافته") {
          Swal({
            title: "هشدار",
            text: e.message,
            icon: "warning",
            button: "باشه",
          });
        } else {
          Swal({
            title: "خطا",
            text: e?.message || "خطا در اسکن",
            icon: "error",
            button: "باشه",
          });
        }
        return;
      }

      const data = await res.json();
      console.log("API response data:", data);
      setState(data.state);
      setRole(data.role);
      setMessage(data.message);
      setPlayer1(data.player1 ? data.player1.toString() : null);
      setPlayer2(data.player2 ? data.player2.toString() : null);
      setPendingResult(
        data.session && data.session.pendingResult
          ? data.session.pendingResult
          : null
      );
      setLastSession(data.session ? data.session : null);

      if (data.state === "pendingStart") {
        Swal({
          title: "منتظر بازیکن دوم",
          text: data.message,
          icon: "info",
          button: "باشه",
        });
      } else if (data.state === "active") {
        Swal({
          title: "جلسه شروع شد",
          text: `${data.message} - نقش شما: بازیکن ${data.role}`,
          icon: "success",
          button: "باشه",
        });
      } else if (data.state === "pendingEnd") {
        Swal({
          title: "منتظر پایان",
          text: data.message,
          icon: "info",
          button: "باشه",
        });
      } else if (data.state === "ended") {
        Swal({
          title: "جلسه پایان یافت",
          text: data.message,
          icon: "success",
          button: "باشه",
        });
      } else {
        console.warn("Unexpected state received:", data.state);
        Swal({
          title: "خطا",
          text: data.message || "خطای ناشناخته",
          icon: "error",
          button: "باشه",
        });
      }

      if (data.state !== "active") {
        setTimer(0);
      }

      // Don't stop scanner here - let user manually stop or scan again
    } catch (err) {
      console.error("Fetch error:", err);
      Swal({
        title: "خطا",
        text: "بروز خطا هنگام پردازش اسکن",
        icon: "error",
        button: "باشه",
      });
    }
  };
  const submitResult = async (e) => {
    e.preventDefault();
    if (!currentUserId) return;
    if (!lastSession || !lastSession._id) {
      Swal({
        title: "خطا",
        text: "اطلاعات جلسه موجود نیست، لطفاً کنسول را مجدداً اسکن کنید",
        icon: "error",
        button: "باشه",
      });
      return;
    }

    // Map inputs to player1/player2 ordering
    const isPlayer1 = player1 === currentUserId;
    const body = {
      sessionId: lastSession._id,
      userId: currentUserId,
      player1Goals: isPlayer1 ? Number(p1GoalsInput) : Number(p2GoalsInput),
      player2Goals: isPlayer1 ? Number(p2GoalsInput) : Number(p1GoalsInput),
    };

    try {
      const res = await fetchWithRefresh("/api/sessions/submit-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });

      if (!res || !res.ok) {
        const e = await res.json().catch(() => ({}));
        Swal({
          title: "خطا",
          text: e.message || "خطا در ثبت نتیجه",
          icon: "error",
          button: "باشه",
        });
        return;
      }

      const data = await res.json();
      setPendingResult(data.pendingResult || null);
      Swal({
        title: "ثبت شد",
        text: data.message || "نتیجه ثبت شد و منتظر تایید رقیب است",
        icon: "success",
        button: "باشه",
      });
    } catch (err) {
      console.error(err);
      Swal({
        title: "خطا",
        text: "خطا در ثبت نتیجه",
        icon: "error",
        button: "باشه",
      });
    }
  };

  const confirmPendingResult = async () => {
    if (!currentUserId || !lastSession || !lastSession._id) return;
    try {
      const res = await fetchWithRefresh("/api/sessions/confirm-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: lastSession._id,
          userId: currentUserId,
        }),
        credentials: "include",
      });

      if (!res || !res.ok) {
        const e = await res.json().catch(() => ({}));
        Swal({
          title: "خطا",
          text: e.message || "خطا در تایید نتیجه",
          icon: "error",
          button: "باشه",
        });
        return;
      }

      const data = await res.json();
      setPendingResult(null);
      Swal({
        title: "تایید شد",
        text: data.message || "نتیجه تایید و امتیازات اعمال شد",
        icon: "success",
        button: "باشه",
      });
    } catch (err) {
      console.error(err);
      Swal({
        title: "خطا",
        text: "خطای داخلی هنگام تایید نتیجه",
        icon: "error",
        button: "باشه",
      });
    }
  };

  const onManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualBarcode) {
      Swal({
        title: "خطا",
        text: "لطفاً بارکد را وارد کنید",
        icon: "error",
        button: "باشه",
      });
      return;
    }
    await onScan(manualBarcode);
  };

  const formatTimer = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
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

            {(state === "active" || state === "pendingEnd") &&
              currentUserId &&
              (player1 === currentUserId || player2 === currentUserId) && (
                <div className="mt-4 w-full max-w-md rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 p-3 text-center">
                  {state === "active" && "جلسه فعال است"}
                  {state === "pendingEnd" && "منتظر پایان جلسه"}
                  {role && <span> - نقش شما: بازیکن {role}</span>}
                  <div className="mt-2 font-semibold">
                    مدت زمان: {formatTimer(timer)}
                  </div>
                </div>
              )}

            {state === "ended" &&
              currentUserId &&
              (player1 === currentUserId || player2 === currentUserId) && (
                <div className="mt-4 w-full max-w-md rounded-xl bg-slate-50 dark:bg-slate-900/30 text-slate-900 dark:text-slate-100 p-4">
                  <h3 className="font-bold mb-2">ثبت نتیجه بازی</h3>

                  {pendingResult ? (
                    <div>
                      <p className="mb-2">نتیجه پیشنهادی توسط بازیکن دیگر:</p>
                      <div className="flex items-center gap-4 mb-3">
                        <div className="px-3 py-2 bg-white rounded shadow">
                          گل بازیکن اول:{" "}
                          {pendingResult.proposer &&
                            (pendingResult.proposer.toString() === player1
                              ? pendingResult.proposerGoals
                              : pendingResult.opponentGoals)}
                        </div>
                        <div className="px-3 py-2 bg-white rounded shadow">
                          گل بازیکن دوم:{" "}
                          {pendingResult.proposer &&
                            (pendingResult.proposer.toString() === player2
                              ? pendingResult.proposerGoals
                              : pendingResult.opponentGoals)}
                        </div>
                      </div>

                      {/* if current user is opponent and can confirm */}
                      {pendingResult.proposer &&
                        pendingResult.proposer.toString() !== currentUserId && (
                          <div className="flex gap-2">
                            <button
                              onClick={confirmPendingResult}
                              className="px-4 py-2 bg-emerald-600 text-white rounded"
                            >
                              تایید نتیجه
                            </button>
                            <button
                              onClick={() =>
                                Swal({
                                  title: "اخطار",
                                  text: "در نسخه فعلی امکان رد نتیجه از طریق اپ وجود ندارد. در صورت اختلاف به مسئول گیم‌نت مراجعه کنید.",
                                  icon: "warning",
                                  button: "باشه",
                                })
                              }
                              className="px-4 py-2 bg-rose-500 text-white rounded"
                            >
                              رد نتیجه
                            </button>
                          </div>
                        )}

                      {/* if current user is proposer, show waiting message */}
                      {pendingResult.proposer &&
                        pendingResult.proposer.toString() === currentUserId && (
                          <div className="mt-2 text-sm text-gray-600">
                            شما نتیجه را ثبت کرده‌اید و اکنون منتظر تایید رقیب
                            هستید.
                          </div>
                        )}
                    </div>
                  ) : (
                    <form
                      onSubmit={submitResult}
                      className="flex flex-col gap-2"
                    >
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min={0}
                          value={p1GoalsInput}
                          onChange={(e) => setP1GoalsInput(e.target.value)}
                          className="flex-1 px-3 py-2 rounded border"
                          placeholder="گل بازیکن اول"
                        />
                        <input
                          type="number"
                          min={0}
                          value={p2GoalsInput}
                          onChange={(e) => setP2GoalsInput(e.target.value)}
                          className="flex-1 px-3 py-2 rounded border"
                          placeholder="گل بازیکن دوم"
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded"
                        >
                          ثبت و ارسال برای تایید
                        </button>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        پس از تایید، امتیازات به صورت خودکار محاسبه می‌شوند. ثبت
                        نتیجه بعدی حداقل {10} دقیقه طول خواهد کشید.
                      </div>
                    </form>
                  )}
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
