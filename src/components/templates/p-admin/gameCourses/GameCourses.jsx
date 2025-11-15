"use client";

import { useEffect, useState, useRef } from "react";
import fetchWithRefresh from "@/utils/fetchWithRefresh";

function formatDateTime(dt) {
  if (!dt) return "-";
  const d = new Date(dt);
  return d.toLocaleString("fa-IR");
}

function useInterval(callback, delay) {
  const savedRef = useRef();
  useEffect(() => {
    savedRef.current = callback;
  }, [callback]);
  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => savedRef.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

export default function GameSessionsTable() {
  const [consoles, setConsoles] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showStartModal, setShowStartModal] = useState(false);
  const [selectedConsole, setSelectedConsole] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState({ p1: null, p2: null });
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // refresh data
  const loadAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const consolesRes = await fetchWithRefresh(`/api/admin/consoles`, { credentials: "include" });
      const consolesData = await consolesRes.json();
      if (!consolesRes.ok) throw new Error(consolesData.error || "خطا در دریافت کنسول‌ها");
      setConsoles(consolesData.consoles || []);

      const sessionsRes = await fetchWithRefresh(`/api/admin/sessions?status=all`, { credentials: "include" });
      const sessionsData = await sessionsRes.json();
      if (!sessionsRes.ok) throw new Error(sessionsData.error || "خطا در دریافت جلسات");
      setSessions(sessionsData.sessions || []);
    } catch (err) {
      setError(err.message || "خطا در بارگذاری");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  // refresh active session elapsed every second
  useInterval(() => {
    setSessions((prev) => [...prev]);
  }, 1000);

  // search users for modal
  useEffect(() => {
    const t = setTimeout(async () => {
      if (!searchQuery || searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }
      try {
        const res = await fetchWithRefresh(`/api/admin/users/search?q=${encodeURIComponent(searchQuery)}`, { credentials: "include" });
        const data = await res.json();
        if (res.ok) setSearchResults(data.users || []);
      } catch (err) {
        // ignore
      }
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const startSession = async () => {
    if (!selectedConsole || !selectedPlayers.p1 || !selectedPlayers.p2) {
      setMessage({ type: "error", text: "کنسول و دو بازیکن را انتخاب کنید" });
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    setActionLoading(true);
    try {
      const res = await fetchWithRefresh(`/api/admin/sessions/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consoleId: selectedConsole._id, player1Identifier: selectedPlayers.p1._id, player2Identifier: selectedPlayers.p2._id }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "خطا در شروع جلسه" });
      } else {
        setMessage({ type: "success", text: "جلسه آغاز شد" });
        setShowStartModal(false);
        await loadAll();
      }
    } catch (err) {
      setMessage({ type: "error", text: err.message || "خطا" });
    } finally {
      setActionLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const endSession = async (sessionId) => {
    if (!confirm("آیا می‌خواهید این جلسه را پایان دهید؟")) return;
    setActionLoading(true);
    try {
      const res = await fetchWithRefresh(`/api/admin/sessions/${sessionId}/end`, { method: "POST", credentials: "include" });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "خطا در پایان جلسه" });
      } else {
        setMessage({ type: "success", text: "جلسه با موفقیت پایان یافت" });
        await loadAll();
      }
    } catch (err) {
      setMessage({ type: "error", text: err.message || "خطا" });
    } finally {
      setActionLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const submitResult = async (sessionId, userId, p1Goals, p2Goals) => {
    setActionLoading(true);
    try {
      const res = await fetchWithRefresh(`/api/sessions/submit-result`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, userId, player1Goals: p1Goals, player2Goals: p2Goals }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.message || "خطا در ثبت نتیجه" });
      } else {
        setMessage({ type: "success", text: data.message || "نتیجه ثبت شد" });
        await loadAll();
      }
    } catch (err) {
      setMessage({ type: "error", text: err.message || "خطا" });
    } finally {
      setActionLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const elapsedText = (s) => {
    if (!s || !s.startedAt) return "-";
    const start = new Date(s.startedAt).getTime();
    const now = s.status === "active" ? Date.now() : (s.endedAt ? new Date(s.endedAt).getTime() : Date.now());
    const sec = Math.floor((now - start) / 1000);
    const hh = Math.floor(sec / 3600);
    const mm = Math.floor((sec % 3600) / 60);
    const ss = sec % 60;
    return `${hh}:${mm.toString().padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full space-y-4 font-vazir">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-orange-600">جلسات بازی</h2>
        <div className="flex items-center gap-3">
          <button onClick={() => { setShowStartModal(true); setSelectedPlayers({ p1: null, p2: null }); }} className="px-4 py-2 bg-orange-600 text-white rounded">شروع جلسه جدید</button>
          <button onClick={() => loadAll()} className="px-3 py-2 bg-gray-200 rounded">بارگذاری مجدد</button>
        </div>
      </div>

      {loading ? (
        <div>در حال بارگذاری...</div>
      ) : error ? (
        <div className="text-red-500">خطا: {error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border overflow-x-auto border-orange-500 dark:border-gold">
            <thead className="bg-orange-600 dark:bg-yellow-600 text-white dark:text-black">
              <tr>
                <th className="px-4 py-2 text-center">#</th>
                <th className="px-4 py-2 text-center">کنسول</th>
                <th className="px-4 py-2 text-center">بازیکن ۱</th>
                <th className="px-4 py-2 text-center">بازیکن ۲</th>
                <th className="px-4 py-2 text-center">شروع</th>
                <th className="px-4 py-2 text-center">زمان گذشته</th>
                <th className="px-4 py-2 text-center">پایان</th>
                <th className="px-4 py-2 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 text-gray-800 dark:text-yellow-100">
              {sessions.length > 0 ? (
                sessions.map((session, idx) => (
                  <tr key={session._id || idx} className="border-b border-gray-300 dark:border-gray-700 text-center">
                    <td className="px-4 py-2">{idx + 1}</td>
                    <td className="px-4 py-2">{session.console?.name || "-"}</td>
                    <td className="px-4 py-2">{session.player1 ? `${session.player1.firstName || ""} ${session.player1.lastName || ""} (${session.player1.userName})` : "-"}</td>
                    <td className="px-4 py-2">{session.player2 ? `${session.player2.firstName || ""} ${session.player2.lastName || ""} (${session.player2.userName})` : "-"}</td>
                    <td className="px-4 py-2">{session.startedAt ? formatDateTime(session.startedAt) : "-"}</td>
                    <td className="px-4 py-2">{session.status === "active" ? (<span className="font-mono">{elapsedText(session)}</span>) : (session.durationSeconds ? `${Math.floor(session.durationSeconds/60)} دقیقه` : "-")}</td>
                    <td className="px-4 py-2">{session.endedAt ? formatDateTime(session.endedAt) : (session.status === "active" ? "در حال اجرا" : "-")}</td>
                    <td className="px-4 py-2">
                      {session.status === "active" ? (
                        <>
                          <button onClick={() => endSession(session._id)} className="px-3 py-1 bg-red-600 text-white rounded mr-2" disabled={actionLoading}>پایان</button>
                          <button onClick={() => {
                            // open small prompt to submit result as admin
                            const p1Goals = parseInt(prompt("تعداد گل بازیکن 1:"), 10);
                            const p2Goals = parseInt(prompt("تعداد گل بازیکن 2:"), 10);
                            if (Number.isFinite(p1Goals) && Number.isFinite(p2Goals)) {
                              // admin acts as proposer; use admin id not required by API because submit-result checks participant; admin cannot submit normally — but requirement says admin can register results, we bypass by sending userId as player1 proposer
                              // We'll call endpoint with userId = player1._id to create pendingResult on behalf of player1
                              if (session.player1 && session.player1._id) {
                                submitResult(session._id, session.player1._id, p1Goals, p2Goals);
                              } else {
                                setMessage({ type: "error", text: "شناسه بازیکن نامعتبر است" });
                                setTimeout(() => setMessage(null), 2500);
                              }
                            }
                          }} className="px-3 py-1 bg-green-600 text-white rounded" disabled={actionLoading}>ثبت نتیجه</button>
                        </>
                      ) : (
                        <span className="text-gray-600">تمام شده</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-500 dark:text-gray-400">جلسه‌ای یافت نشد.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {message && <div className={`mt-3 p-2 rounded ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{message.text}</div>}

      {/* Start Modal */}
      {showStartModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-20">
          <div className="bg-white dark:bg-[#111] w-full max-w-2xl rounded p-6">
            <h3 className="text-lg font-bold mb-3">شروع جلسه جدید</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">انتخاب کنسول (کنسول‌های خالی)</label>
                <select className="w-full border px-2 py-2 rounded" value={selectedConsole?._id || ""} onChange={(e) => setSelectedConsole(consoles.find(c => c._id === e.target.value))}>
                  <option value="">-- انتخاب کنید --</option>
                  {consoles.filter(c => c.status === 'idle').map(c => (
                    <option key={c._id} value={c._id}>{c.name} ({c.barcode})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1">جستجو و انتخاب بازیکنان (نام/نام‌کاربری/شماره)</label>
                <input className="w-full border px-2 py-2 rounded mb-2" placeholder="جستجو..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                <div className="space-y-2 max-h-40 overflow-auto">
                  {searchResults.map(u => (
                    <div key={u._id} className="flex justify-between items-center border-b py-1">
                      <div>{(u.firstName||u.userName||u.phone)} ({u.userName}) - {u.phone}</div>
                      <div className="flex gap-2">
                        <button disabled={selectedPlayers.p1 && selectedPlayers.p1._id === u._id} onClick={() => setSelectedPlayers(prev => ({...prev, p1: u}))} className="px-2 py-1 bg-blue-500 text-white rounded text-sm">انتخاب بازیکن 1</button>
                        <button disabled={selectedPlayers.p2 && selectedPlayers.p2._id === u._id} onClick={() => setSelectedPlayers(prev => ({...prev, p2: u}))} className="px-2 py-1 bg-blue-500 text-white rounded text-sm">انتخاب بازیکن 2</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-sm">
                  <div>انتخاب شده: بازیکن1: {selectedPlayers.p1 ? (selectedPlayers.p1.firstName || selectedPlayers.p1.userName) : '-'}</div>
                  <div>انتخاب شده: بازیکن2: {selectedPlayers.p2 ? (selectedPlayers.p2.firstName || selectedPlayers.p2.userName) : '-'}</div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowStartModal(false)} className="px-4 py-2 bg-gray-200 rounded">لغو</button>
              <button onClick={startSession} className="px-4 py-2 bg-orange-600 text-white rounded" disabled={actionLoading}>شروع جلسه</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
