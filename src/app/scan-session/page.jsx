"use client";

import { useEffect, useRef, useState, useCallback } from "react"; // [!!] useCallback اضافه شد
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
  const [pendingResult, setPendingResult] = useState(null); // [!!! تغییر 1: State های فرم نتیجه !!!]

  const [myGoalsInput, setMyGoalsInput] = useState("");
  const [opponentGoalsInput, setOpponentGoalsInput] = useState("");

  const [lastSession, setLastSession] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [cooldownMessage, setCooldownMessage] = useState("");
  const [isSubmissionDisabled, setIsSubmissionDisabled] = useState(false);

  const lastScanRef = useRef({ value: null, at: 0 }); // [!!! تغییر 2: تابع فراخوانی وضعیت، بیرون از افکت !!!] // ما این تابع را در چند جا نیاز داریم، پس آن را با useCallback تعریف می‌کنیم

  const fetchCurrentSession = useCallback(async (userId) => {
    if (!userId) return; // setIsLoading(true); // لودینگ را فقط در بار اول نشان می‌دهیم
    try {
      const res = await fetchWithRefresh("/api/sessions/current-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId }),
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.session) {
          const session = data.session;
          setState(session.status);
          setPlayer1(session.player1 ? session.player1.toString() : null);
          setPlayer2(session.player2 ? session.player2.toString() : null);
          setLastSession(session);
          setPendingResult(session.pendingResult || null);
          if (session.player1 && session.player1.toString() === userId) {
            setRole(1);
          } else if (session.player2 && session.player2.toString() === userId) {
            setRole(2);
          }

          if (session.status === "active" && session.startedAt) {
            const startTime = new Date(session.startedAt).getTime();
            const now = Date.now();
            const secondsElapsed = Math.floor((now - startTime) / 1000);
            setTimer(secondsElapsed);
          }
        } else {
          // No active session, reset states
          setState(null);
          setPlayer1(null);
          setPlayer2(null);
          setLastSession(null);
          setPendingResult(null);
          setTimer(0);
          setRole(null);
        }
      }
    } catch (err) {
      console.error("Error fetching current status:", err);
    } finally {
      setIsLoading(false); // در هر صورت لودینگ تمام می‌شود
    }
  }, []); // این تابع وابستگی ندارد // گرفتن userId و تنظیم Pusher

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
    let unsubscribe3 = null;
    let unsubscribe4 = null;

    const setupRealtime = async () => {
      if (!currentUserId) return;
      try {
        const { subscribe } = await import("@/utils/pusherClient"); // [!!! تغییر 3: اصلاح شنونده پوشر !!!]

        unsubscribe1 = subscribe(
          `user-${currentUserId}`,
          "pending-result",
          (data) => {
            Swal({
              title: "درخواست تایید نتیجه",
              text: "رقیب شما یک نتیجه ثبت کرده است. صفحه در حال به‌روزرسانی...",
              icon: "info",
              button: "باشه",
              timer: 2000,
            }); // دوباره وضعیت را فراخوانی کن تا pendingResult جدید نمایش داده شود
            fetchCurrentSession(currentUserId);
          }
        );
        unsubscribe2 = subscribe(
          `user-${currentUserId}`,
          "result-confirmed",
          (data) => {
            Swal({
              title: "نتیجه تایید شد",
              text: "نتیجه بازی شما تایید و امتیازات اعمال شد.",
              icon: "success",
              button: "باشه",
            }); // دوباره وضعیت را فراخوانی کن تا pendingResult پاک شود و آرایه results آپدیت شود
            fetchCurrentSession(currentUserId);
          }
        );
        unsubscribe3 = subscribe(
          `user-${currentUserId}`,
          "session-updated",
          (data) => {
            console.log("Pusher received session-updated:", data);
            Swal({
              title: "وضعیت جلسه به‌روز شد",
              text: data.message || "وضعیت جلسه شما تغییر کرد.",
              icon: "info",
              button: "باشه",
            }); // آپدیت مستقیم state ها
            setState(data.state);
            setPlayer1(data.player1 ? data.player1.toString() : null);
            setPlayer2(data.player2 ? data.player2.toString() : null);
            setLastSession(data.session);
            if (data.state === "active" && data.session.startedAt) {
              const startTime = new Date(data.session.startedAt).getTime();
              const now = Date.now();
              const secondsElapsed = Math.floor((now - startTime) / 1000);
              setTimer(secondsElapsed);
            } else if (data.state !== "active") {
              setTimer(0);
            }
          }
        );
        unsubscribe4 = subscribe(
          `user-${currentUserId}`,
          "result-rejected",
          (data) => {
            Swal({
              title: "نتیجه رد شد",
              text: "پیشنهاد شما توسط حریف رد شد. می‌توانید نتیجه جدیدی ثبت کنید.",
              icon: "warning",
              button: "باشه",
            }); // وضعیت را دوباره فراخوانی کن تا pendingResult پاک شود
            fetchCurrentSession(currentUserId);
          }
        );
      } catch (err) {
        console.warn("Pusher client not available", err?.message || err);
      }
    };

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
      try {
        unsubscribe3 && unsubscribe3();
      } catch (e) {}
      try {
        unsubscribe4 && unsubscribe4();
      } catch (e) {}
    };
  }, [router, currentUserId, fetchCurrentSession]); // fetchCurrentSession به وابستگی اضافه شد // افکت برای بارگذاری اولیه وضعیت

  useEffect(() => {
    if (currentUserId) {
      setIsLoading(true); // فقط بار اول لودینگ را نشان بده
      fetchCurrentSession(currentUserId);
    }
  }, [currentUserId, fetchCurrentSession]); // (کدهای startScanner و stopScanner... بدون تغییر) // ... // Start scanner

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
      } // Create new scanner instance if needed

      if (!qrInstanceRef.current) {
        qrInstanceRef.current = new Html5Qrcode("reader", { verbose: false });
      } // Check if already scanning

      try {
        const isScanning =
          qrInstanceRef.current.isScanning &&
          qrInstanceRef.current.isScanning();
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
            facingMode: "environment",
          },
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
  }; // Stop scanner

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
    } // Reset state

    isRunningRef.current = false;
    setIsScanning(false);
  }; // تایمر
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
  }, [state, currentUserId, player1, player2]); // افکت مدیریت Cooldown دکمه

  useEffect(() => {
    if (state !== "active") {
      setIsSubmissionDisabled(true);
      setCooldownMessage("");
      return;
    }

    const now = Date.now();
    const lastResult =
      lastSession?.results && lastSession.results.length > 0
        ? lastSession.results[lastSession.results.length - 1]
        : null;
    const cooldownSeconds = 600; // 10 دقیقه

    if (lastResult) {
      const lastResultTime = new Date(lastResult.recordedAt).getTime();
      const diffSeconds = (now - lastResultTime) / 1000;

      if (diffSeconds < cooldownSeconds) {
        setIsSubmissionDisabled(true);
        const minutesLeft = Math.ceil((cooldownSeconds - diffSeconds) / 60);
        setCooldownMessage(
          `نتیجه قبلی تازه ثبت شد. ${minutesLeft} دقیقه تا ثبت بعدی مانده.`
        );
      } else {
        setIsSubmissionDisabled(false);
        setCooldownMessage("");
      }
    } else {
      const startTime = lastSession?.startedAt
        ? new Date(lastSession.startedAt).getTime()
        : now;
      const diffSeconds = (now - startTime) / 1000;

      if (diffSeconds < cooldownSeconds) {
        setIsSubmissionDisabled(true);
        const minutesLeft = Math.ceil((cooldownSeconds - diffSeconds) / 60);
        setCooldownMessage(
          `امکان ثبت اولین نتیجه تا ${minutesLeft} دقیقه دیگر وجود ندارد.`
        );
      } else {
        setIsSubmissionDisabled(false);
        setCooldownMessage("");
      }
    }
  }, [timer, lastSession, state]); // وابسته به تایمر، جلسه، و وضعیت // پاکسازی اسکنر

  useEffect(() => {
    return () => {
      if (qrInstanceRef.current && isRunningRef.current) {
        stopScanner();
      }
    };
  }, []); // تابع onScan (بدون تغییر)

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
    let actualBarcode = barcode;
    try {
      const parsed = JSON.parse(barcode);
      if (parsed && parsed.barcode) {
        actualBarcode = parsed.barcode;
        console.log("Extracted barcode from JSON:", actualBarcode);
      }
    } catch (e) {
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
        state === "active" || state === "pendingEnd"
          ? "/api/sessions/end-scan"
          : "/api/sessions/scan",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            barcode: actualBarcode,
            userId: currentUserId,
          }),
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
        Swal({
          title: "خطا",
          text: e?.message || "خطا در اسکن",
          icon: "error",
          button: "باشه",
        });
        return;
      }

      const data = await res.json();
      console.log("API response data:", data); // آپدیت State ها
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
      setLastSession(data.session ? data.session : null); // نمایش پیام مناسب

      Swal({
        title:
          data.state === "active"
            ? "جلسه شروع شد"
            : data.state === "ended"
            ? "جلسه پایان یافت"
            : "اعلان",
        text: data.message,
        icon:
          data.state === "active" || data.state === "ended"
            ? "success"
            : "info",
        button: "باشه",
      });

      if (data.state !== "active") {
        setTimer(0);
      } else if (data.state === "active" && data.session?.startedAt) {
        // تنظیم تایمر برای کسی که اسکن دوم را زده
        const startTime = new Date(data.session.startedAt).getTime();
        const now = Date.now();
        const secondsElapsed = Math.floor((now - startTime) / 1000);
        setTimer(secondsElapsed);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      Swal({
        title: "خطا",
        text: "بروز خطا هنگام پردازش اسکن",
        icon: "error",
        button: "باشه",
      });
    }
  }; // [!!! تغییر 4: تابع submitResult اصلاح شده !!!]

  const submitResult = async (e) => {
    e.preventDefault();
    if (!currentUserId || !lastSession || !lastSession._id) {
      Swal({
        title: "خطا",
        text: "اطلاعات جلسه موجود نیست",
        icon: "error",
        button: "باشه",
      });
      return;
    }

    const isPlayer1 = player1 === currentUserId;
    const body = {
      sessionId: lastSession._id,
      userId: currentUserId, // منطق جدید: ارسال گل‌ها بر اساس "من" و "حریف"
      player1Goals: isPlayer1
        ? Number(myGoalsInput)
        : Number(opponentGoalsInput),
      player2Goals: isPlayer1
        ? Number(opponentGoalsInput)
        : Number(myGoalsInput),
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

      const data = await res.json(); // state ها را ریست می‌کنیم چون پوشر بقیه کار را انجام می‌دهد
      setMyGoalsInput("");
      setOpponentGoalsInput("");
      setPendingResult(data.pendingResult || null); // خود پیشنهاد دهنده هم UI را می‌بیند

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
  }; // تابع confirmPendingResult (بدون تغییر)

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

      const data = await res.json(); // state ها را ریست می‌کنیم چون پوشر بقیه کار را انجام می‌دهد
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
  }; // تابع onManualSubmit (بدون تغییر)
  const rejectPendingResult = async () => {
    if (!currentUserId || !lastSession || !lastSession._id) return; // اول از کاربر سوال تایید بپرس

    const willReject = await Swal({
      title: "آیا مطمئن هستید؟",
      text: "آیا می‌خواهید این نتیجه پیشنهادی را رد کنید؟",
      icon: "warning",
      buttons: ["انصراف", "بله، رد می‌کنم"],
      dangerMode: true,
    });

    if (!willReject) {
      return; // کاربر انصراف زد
    }

    try {
      const res = await fetchWithRefresh("/api/sessions/reject-result", {
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
          text: e.message || "خطا در رد کردن نتیجه",
          icon: "error",
          button: "باشه",
        });
        return;
      }

      const data = await res.json();
      setPendingResult(null); // UI را بلافاصله پاک کن
      Swal({
        title: "نتیجه رد شد",
        text: data.message || "نتیجه پیشنهادی رد شد.",
        icon: "success",
        button: "باشه",
      });
    } catch (err) {
      console.error(err);
      Swal({
        title: "خطا",
        text: "خطای داخلی هنگام رد کردن نتیجه",
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
  }; // تابع formatTimer (بدون تغییر)

  const formatTimer = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }; // [!!!] JSX مدیریت لودینگ

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-900">
               {" "}
        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    در حال بارگذاری اطلاعات جلسه...        {" "}
        </div>
             {" "}
      </div>
    );
  } // [!!!] متغیرهای کمکی برای JSX // این محاسبات را اینجا انجام می‌دهیم تا JSX تمیزتر باشد

  const isProposerP1 = pendingResult
    ? pendingResult.proposer.toString() === player1
    : false;
  const p1ProposedGoals = pendingResult
    ? isProposerP1
      ? pendingResult.proposerGoals
      : pendingResult.opponentGoals
    : 0;
  const p2ProposedGoals = pendingResult
    ? isProposerP1
      ? pendingResult.opponentGoals
      : pendingResult.proposerGoals
    : 0;
  const isCurrentUserOpponent = pendingResult
    ? pendingResult.proposer.toString() !== currentUserId
    : false;

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
                className=" px-6 py-3 cursor-pointer  text-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
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
                  {lastSession && lastSession.startedAt && (
                    <div className="mt-1 text-sm">
                      شروع:
                      {new Date(lastSession.startedAt).toLocaleTimeString(
                        "fa-IR"
                      )}
                    </div>
                  )}
                  <div className="mt-2 font-semibold">
                    مدت زمان: {formatTimer(timer)}
                  </div>
                </div>
              )}
            {state === "active" &&
              currentUserId &&
              (player1 === currentUserId || player2 === currentUserId) && (
                <div className="mt-4 w-full max-w-md rounded-xl bg-slate-50 dark:bg-slate-900/30 text-slate-900 dark:text-slate-100 p-4">
                  <h3 className="font-bold mb-3 text-center text-lg">
                    {pendingResult ? "تایید نتیجه بازی" : "ثبت نتیجه بازی"}
                  </h3>
                  {pendingResult ? (
                    <div>
                      <p className="mb-2 font-semibold text-center text-sm dark:text-gray-300">
                        نتیجه پیشنهادی:
                      </p>
                      <div className="flex items-center justify-center gap-4 mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <div className="text-center">
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            بازیکن اول
                          </div>
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {p1ProposedGoals}
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-gray-700 dark:text-gray-300"></div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            بازیکن دوم
                          </div>
                          <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                            {p2ProposedGoals}
                          </div>
                        </div>
                      </div>
                      {isCurrentUserOpponent ? (
                        <div className="flex gap-2">
                          <button
                            onClick={confirmPendingResult}
                            className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700"
                          >
                            تایید نتیجه
                          </button>
                          <button
                            onClick={rejectPendingResult}
                            className="flex-1 px-4 py-2 bg-rose-500 text-white rounded-lg font-semibold hover:bg-rose-600"
                          >
                            رد نتیجه
                          </button>
                        </div>
                      ) : (
                        <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 text-center">
                          شما نتیجه را ثبت کرده‌اید. منتظر تایید رقیب...
                        </div>
                      )}
                    </div>
                  ) : (
                    <form
                      onSubmit={submitResult}
                      className="flex flex-col gap-4"
                    >
                      <div className="flex gap-3 items-center">
                        <label
                          className="text-sm font-medium w-16"
                          htmlFor="myGoals"
                        >
                          گل شما:
                        </label>
                        <input
                          id="myGoals"
                          type="number"
                          min={0}
                          value={myGoalsInput}
                          onChange={(e) => setMyGoalsInput(e.target.value)}
                          className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="0"
                          required
                        />
                      </div>
                      <div className="flex gap-3 items-center">
                        <label
                          className="text-sm font-medium w-16"
                          htmlFor="opponentGoals"
                        >
                          گل حریف:
                        </label>
                        <input
                          id="opponentGoals"
                          type="number"
                          min={0}
                          value={opponentGoalsInput}
                          onChange={(e) =>
                            setOpponentGoalsInput(e.target.value)
                          }
                          className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="0"
                          required
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button
                          type="submit"
                          disabled={isSubmissionDisabled || !!pendingResult}
                          className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          ثبت و ارسال برای تایید
                        </button>
                      </div>
                      {isSubmissionDisabled && cooldownMessage && (
                        <div className="mt-2 text-xs text-amber-600 dark:text-amber-400 text-center">
                          {cooldownMessage}
                        </div>
                      )}
                      <div className="mt-1 text-xs text-gray-500 text-center">
                        ثبت نتیجه بعدی حداقل 10 دقیقه پساز تایید این نتیجه ممکن
                        است.
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
            <ul className="mt-3 list-disc pr-6 text-gray-700 dark:text-gray-300 space-y-0.5">
              <li>
                برای شروع، ابتدا کاربر اول اسکن کند؛ سپس کاربر دوم. برای
                پایان،دوباره به همین ترتیب.
              </li>
              <li>
                در طول جلسه این کنسول برای دیگران قفل است تا پایان کامل جلسه.
              </li>
              <li>
                برای اسکن موفق، بارکد را در کادر مشخص ثابت نگهدارید و از نور
                کافی استفاده کنید.
              </li>
              <li>
                اگر دوربین در دسترس نبود، می‌توانید بارکد را به صورت دستی
                واردکنید.
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
                برای اسکن بارکد کنسول، اجازه دسترسی به دوربین لازم است. آیا
              اجازه می‌دهید؟
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
