"use client";
import ChallengeArticle from "@/components/templates/Profile/ChallengeArticle";
import Image from "next/image";
import React, { useEffect, useState, useMemo } from "react";
import moment from "jalali-moment";
import { FaCalendarAlt, FaGamepad, FaUser } from "react-icons/fa";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { fetchWithRefresh } from "@/utils/getAccessToken";

export default function ProfilePageTemplate({ userId }) {
  const [showChallenge, setShowChallenge] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [challengeForm, setChallengeForm] = useState({
    fightTime: null,
    game: "",
    message: "",
    location: "",
  });
  const [gameNetList, setGameNetList] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest");
  const [challengeType, setChallengeType] = useState("");
  const [challengeStatus, setChallengeStatus] = useState("");
  const [challenges, setChallenges] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const challengesPerPage = 6;

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => setUserProfile(data));
    fetch("/api/gameNet")
      .then((res) => res.json())
      .then((data) => setGameNetList(data));
    fetchWithRefresh("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setCurrentUser(data));
    fetch("/api/challenge")
      .then((res) => res.json())
      .then((data) => setChallenges(Array.isArray(data) ? data : []));
  }, [userId]);

  const handleFormChange = (e) => {
    setChallengeForm({ ...challengeForm, [e.target.name]: e.target.value });
  };
  const handleDateChange = (date) => {
    setChallengeForm({ ...challengeForm, fightTime: date });
  };

  const handleSubmitChallenge = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/challenge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        invited: userProfile?.userName,
        fightTime: challengeForm.fightTime
          ? challengeForm.fightTime.toDate()
          : "",
        game: challengeForm.game,
        message: challengeForm.message,
        location: challengeForm.location,
      }),
    });
    if (res.ok) {
      alert("چالش با موفقیت ارسال شد!");
      setShowChallenge(false);
      setChallengeForm({
        fightTime: null,
        game: "",
        message: "",
        location: "",
      });
    } else {
      alert("ارسال چالش ناموفق بود.");
    }
  };

  let filteredChallenges = challenges;
  if (challengeType === "inviter") {
    filteredChallenges = filteredChallenges.filter(
      (c) => c.inviter?.userName === currentUser?.userName
    );
  } else if (challengeType === "invited") {
    filteredChallenges = filteredChallenges.filter(
      (c) => c.invited?.userName === currentUser?.userName
    );
  }
  if (challengeStatus) {
    filteredChallenges = filteredChallenges.filter(
      (c) => c.status === challengeStatus
    );
  }
  if (sortOrder === "newest") {
    filteredChallenges = filteredChallenges.sort(
      (a, b) => new Date(b.fightTime) - new Date(a.fightTime)
    );
  } else {
    filteredChallenges = filteredChallenges.sort(
      (a, b) => new Date(a.fightTime) - new Date(b.fightTime)
    );
  }

  const profileChallenges = filteredChallenges.filter(
    (challenge) =>
      challenge.inviter?.userName === userProfile?.userName ||
      challenge.invited?.userName === userProfile?.userName
  );

  const totalPages = Math.ceil(profileChallenges.length / challengesPerPage);
  const paginatedChallenges = useMemo(
    () =>
      profileChallenges.slice(
        (currentPage - 1) * challengesPerPage,
        currentPage * challengesPerPage
      ),
    [profileChallenges, currentPage]
  );

  const handleAccept = async (challenge) => {
    await fetch("/api/challenge", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id: challenge._id, status: "accepted" }),
    });
    setChallenges((prev) =>
      prev.map((c) =>
        c._id === challenge._id ? { ...c, status: "accepted" } : c
      )
    );
  };
  const handleReject = async (challenge) => {
    await fetch("/api/challenge", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id: challenge._id, status: "rejected" }),
    });
    setChallenges((prev) =>
      prev.map((c) =>
        c._id === challenge._id ? { ...c, status: "rejected" } : c
      )
    );
  };
  const handleCancel = async (challenge) => {
    await fetch(`/api/challenge/${challenge._id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setChallenges((prev) => prev.filter((c) => c._id !== challenge._id));
  };

  const date = userProfile?.createdAt;
  const persianDate = moment(date).locale("fa").format("YYYY/MM/DD");

  return (
    <>
      <main className="min-h-screen flex flex-col gap-5 md:gap-10 items-center justify-center bg-lime-100 dark:bg-black/90 ">
        <section className="container !p-0 rounded-lg bg-white dark:bg-gray-800 flex flex-col items-center ">
          <div
            style={{
              backgroundImage: `${
                userProfile?.profile
                  ? `url(${process.env.GET_LIARA}/${userProfile?.profile})`
                  : `url(/images/avatar.jpg)`
              }`,
            }}
            className={`w-full h-72 rounded-lg bg-cover bg-center `}
          ></div>

          <div className=" flex md:flex-row flex-col items-center justify-between w-full gap-10  p-5 md:p-10 ">
            <div className="flex items-center gap-5">
              <Image
                src={
                  userProfile?.avatar
                    ? `${process.env.GET_LIARA}/${userProfile?.avatar}`
                    : `/images/user.jpg`
                }
                height={100}
                width={100}
                alt="user image"
                className="rounded-full w-28 h-28 border-4 border-orange-600 dark:border-gold "
              />
              <div className="dark:text-white text-gray-800 flex flex-col gap-4 p-4 rounded-xl bg-white dark:bg-zinc-900 shadow-md">
                <div className="flex items-center gap-2 text-orange-600 dark:text-gold text-lg font-bold">
                  <FaUser className="text-xl" />
                  <span>{userProfile?.userName}</span>
                </div>

                <div className="flex items-center gap-2 text-base md:text-lg">
                  <FaCalendarAlt className="text-orange-500 dark:text-gold" />
                  <span className="text-gray-600 dark:text-gray-300">
                    تاریخ عضویت:
                  </span>
                  <span className="text-gray-800 dark:text-white font-medium">
                    {persianDate}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-base md:text-lg">
                  <FaGamepad className="text-green-600 dark:text-green-400" />
                  <span className="text-gray-600 dark:text-gray-300">
                    گیم‌نت:
                  </span>
                  <span className="text-gray-800 dark:text-white font-medium">
                    {userProfile?.gameNet}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="bg-white dark:bg-zinc-800 p-5 rounded-xl shadow-lg text-center ">
                <p className="text-sm text-gray-400">تعداد بازی</p>
                <p className="text-2xl font-bold text-orange-500">36</p>
              </div>
              <div className="bg-white dark:bg-zinc-800 p-5 rounded-xl shadow-lg text-center">
                <p className="text-sm text-gray-400">برد</p>
                <p className="text-2xl font-bold text-green-500">30</p>
              </div>
              <div className="bg-white dark:bg-zinc-800 p-5 rounded-xl shadow-lg text-center">
                <p className="text-sm text-gray-400">باخت</p>
                <p className="text-2xl font-bold text-red-500">6</p>
              </div>
            </div>
            <div className="flex items-center justify-center flex-col gap-5">
              <p className="text-4xl font-extrabold text-blue-500">
                {" "}
                XP : {userProfile?.xp ? userProfile?.xp : 0}{" "}
              </p>
              {currentUser?.userName !== userProfile?.userName && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setShowChallenge((prev) => !prev)}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white text-lg font-bold shadow-md hover:scale-105 transition-transform"
                  >
                    🎮 به چالش کشیدن
                  </button>
                </div>
              )}
            </div>
            {showChallenge && (
              <form
                onSubmit={handleSubmitChallenge}
                className="flex flex-col gap-4 bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg mt-4 w-full max-w-md"
              >
                <label className="font-vazir">
                  تاریخ و زمان بازی (شمسی):
                  <DatePicker
                    value={challengeForm.fightTime}
                    onChange={handleDateChange}
                    format="YYYY/MM/DD HH:mm"
                    calendar={persian}
                    locale={persian_fa}
                    calendarPosition="bottom-right"
                    plugins={[<TimePicker />]}
                    hideOnScroll
                    placeholder="جهت وارد کردن تاریخ و زمان رقابت کلیک کنید."
                    inputClass="w-full mt-2 p-2 rounded border border-orange-400"
                    required
                  />
                </label>
                <label className="font-vazir">
                  بازی:
                  <select
                    name="game"
                    value={challengeForm.game}
                    onChange={handleFormChange}
                    className="w-full mt-2 p-2 rounded border border-orange-400"
                    required
                  >
                    <option value="" disabled>
                      انتخاب بازی
                    </option>
                    <option value="FIFA 2025">FIFA 2025</option>
                    <option value="eFootball 2021">eFootball 2021</option>
                  </select>
                </label>
                <label className="font-vazir">
                  پیام:
                  <textarea
                    name="message"
                    value={challengeForm.message}
                    onChange={handleFormChange}
                    className="w-full mt-2 p-2 rounded border border-orange-400"
                    rows={2}
                  />
                </label>
                <label className="font-vazir">
                  لوکیشن:
                  <select
                    name="location"
                    value={challengeForm.location}
                    onChange={handleFormChange}
                    className="w-full mt-2 p-2 rounded border border-orange-400"
                    required
                  >
                    <option value="" disabled>
                      انتخاب گیم‌نت
                    </option>
                    {gameNetList.map((loc) => (
                      <option key={loc._id} value={loc?.gameNet}>
                        {loc?.gameNet}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="submit"
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg font-bold mt-2"
                >
                  ارسال چالش
                </button>
              </form>
            )}
          </div>
          <div className="w-full flex flex-col items-center gap-5 p-5">
            <h3 className="text-xl font-bold text-gray-700 dark:text-white mb-2">
              👤 بیو
            </h3>
            <p className="bg-white dark:bg-zinc-800 rounded-lg p-4 border-l-4 border-orange-400 text-gray-700 dark:text-gray-200 shadow">
              {userProfile?.bio || "خالی"}
            </p>
          </div>
          <div className="w-full flex flex-col gap-5 p-5">
            <h3 className="text-3xl font-black dark:text-gray-400">
              {" "}
              افتخارات :{" "}
            </h3>
            <div className=" w-full flex-wrap flex justify-center dark:text-white items-center gap-5">
              <div className="flex flex-wrap items-center gap-2 p-3 rounded-lg  dark:bg-gold dark:text-black bg-orange-600 text-white ">
                <p> 🥇 </p>
                <p> رتبه 1 در گیم نت دراگون </p>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg dark:bg-gold bg-orange-600 dark:text-black text-white">
                <p> 🥇 </p>
                <p> رتبه 1 در گلوبال </p>
              </div>
            </div>
          </div>
        </section>
        <section className="container !p-0 rounded-lg bg-white dark:bg-gray-800 flex flex-col gap-10 items-center">
          <h3 className="text-2xl font-black dark:text-gray-400 mt-10">
            {" "}
            چلنج های انجام داده :{" "}
          </h3>
          <div className="flex items-center gap-5 p-10 ">
            <select
              onChange={(e) => setSortOrder(e.target.value)}
              value={sortOrder}
              className="font-vazir bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-orange-600 dark:border-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:focus:ring-yellow-400 shadow-yellow-glow transition duration-300"
              aria-label="مرتب‌سازی چلنج‌ها"
            >
              <option value="newest">جدیدترین</option>
              <option value="oldest">قدیمی‌ترین</option>
            </select>
            <select
              onChange={(e) => setChallengeType(e.target.value)}
              value={challengeType}
              className="font-vazir bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-orange-600 dark:border-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:focus:ring-yellow-400 shadow-yellow-glow transition duration-300"
              aria-label="نوع چالش"
            >
              <option value="">همه</option>
              <option value="inviter">دعوت‌کننده</option>
              <option value="invited">دعوت‌شده</option>
            </select>
            <select
              onChange={(e) => setChallengeStatus(e.target.value)}
              value={challengeStatus}
              className="font-vazir bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-orange-600 dark:border-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:focus:ring-yellow-400 shadow-yellow-glow transition duration-300"
              aria-label="فیلتر وضعیت چلنج"
            >
              <option value="">همه وضعیت‌ها</option>
              <option value="pending">در انتظار</option>
              <option value="accepted">پذیرفته</option>
              <option value="rejected">رد شده</option>
            </select>
          </div>
          <div className="my-10 flex flex-wrap gap-5 items-center justify-center">
            {paginatedChallenges.length === 0 ? (
              <p className="text-gray-500">هیچ چالشی یافت نشد.</p>
            ) : (
              paginatedChallenges.map((challenge, idx) => {
                const isProfileOwner = currentUser?.userName === userProfile?.userName;
                const isInviter = isProfileOwner && challenge.inviter?.userName === currentUser?.userName;
                const isInvited = isProfileOwner && challenge.invited?.userName === currentUser?.userName;
                return (
                  <div
                    key={challenge._id + '-' + isInvited + '-' + idx}
                    className="max-w-md w-full sm:w-[350px] flex-shrink-0"
                  >
                    <ChallengeArticle
                      challenge={challenge}
                      handleAccept={handleAccept}
                      handleReject={handleReject}
                      handleCancel={handleCancel}
                      isInvited={isInvited}
                      isInviter={isInviter}
                    />
                  </div>
                );
              })
            )}
          </div>
          {/* pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 my-6">
              <button
                className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                قبلی
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={`px-3 py-1 rounded font-bold ${
                    currentPage === i + 1
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                  }`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                بعدی
              </button>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
