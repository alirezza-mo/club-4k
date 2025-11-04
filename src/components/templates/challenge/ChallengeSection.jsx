"use client";
import React, { useEffect, useState } from "react";
import ChallengeForm from "./ChallengeForm";
import ChallengeCard from "./ChallengeCard";
import { fetchWithRefresh } from "@/utils/getAccessToken";

function ChallengeSection() {
  const [challenges, setChallenges] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [challengeType, setChallengeType] = useState("inviter");
  const [userData, setUserData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchWithRefresh("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setUserData(data));
  }, []);

  const fetchData = async () => {
    setIsLoading(true);

    const challengesRes = await fetch("/api/challenge");
    const challengesData = await challengesRes.json();
    setChallenges(challengesData);

    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChallengeCreated = (newChallenge) => {
    setChallenges((prev) => [...prev, newChallenge]);
  };

  const handleAccept = (challenge) => {
    if (
      challenge.status === "pending" &&
      challenge.invited?.userName === userData?.userName
    ) {
      setChallenges((prev) =>
        prev.map((c) =>
          c._id === challenge._id ? { ...c, status: "accepted" } : c
        )
      );
      fetch(`/api/challenge/${challenge._id}`, {
        method: "PUT",
        credentials: "include",
      });
    }
  };

  const handleReject = (challenge) => {
    // فقط اگر کاربر دعوت‌کننده است و وضعیت چالش pending باشد
    if (
      challenge.status === "pending" &&
      challenge.inviter?.userName === userData?.userName
    ) {
      setChallenges((prev) => prev.filter((c) => c.id !== challenge.id));
      fetch(`/api/challenge/${challenge._id}`, {
        method: "DELETE",
        credentials: "include",
      });
    }
  };

  const handleCancel = (challenge) => {
    setChallenges((prev) => prev.filter((c) => c.id !== challenge.id));
  };

  const filteredChallenges = statusFilter
    ? challenges.filter((challenge) => challenge.status === statusFilter)
    : challenges;
  const filteredChallengesRole = filteredChallenges?.filter((challenge) => {
    if (challengeType === "inviter") {
      return challenge.inviter?.userName === userData?.userName;
    }
    return challenge.invited?.userName === userData?.userName;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredChallengesRole.length / itemsPerPage);
  const paginatedChallenges = filteredChallengesRole.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return (
    <>
      <h1 className="font-inter mt-24 text-4xl font-bold text-center text-orange-600 dark:text-yellow-400 text-shadow-yellow-glow mb-4 animate-fadeIn">
        چلنج‌های 1v1
      </h1>
      <p className="font-vazir text-center text-gray-700 dark:text-gray-200 mb-8 animate-fadeIn">
        گیمرت رو به یه نبرد رو در رو دعوت کن!
      </p>
      {/* Form Section */}
      <div className="mb-12 animate-fadeIn">
        <h2 className="font-vazir text-2xl font-bold text-center text-orange-600 dark:text-yellow-400 mb-4">
          ایجاد چلنج جدید
        </h2>
        <ChallengeForm
          onChallengeCreated={handleChallengeCreated}
          users={users}
        />
      </div>
      {/* Challenges List */}
      <div>
        <h2 className="font-vazir text-2xl font-bold text-center text-orange-600 dark:text-yellow-400 mb-4">
          چلنج‌های من
        </h2>
        <div className="w-full flex items-center justify-between">
          <div className="flex justify-center mb-4 gap-4">
            <select
              onChange={(e) => setChallengeType(e.target.value)}
              value={challengeType}
              className="font-vazir bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-orange-600 dark:border-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:focus:ring-yellow-400 shadow-yellow-glow transition duration-300"
              aria-label="نوع چالش"
            >
              <option value="inviter">چلنج‌های دعوت‌کننده</option>
              <option value="invited">چلنج‌های دعوت‌شده</option>
            </select>
          </div>
          <div className="flex justify-center mb-4">
            <select
              onChange={(e) => setStatusFilter(e.target.value)}
              className="font-vazir bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-orange-600 dark:border-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:focus:ring-yellow-400 shadow-yellow-glow transition duration-300"
              aria-label="فیلتر بر اساس وضعیت"
            >
              <option value="">همه وضعیت‌ها</option>
              <option value="pending">در انتظار</option>
              <option value="accepted">تأییدشده</option>
              <option value="rejected">ردشده</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedChallenges.map((challenge, index) => {
            if (challengeType === "inviter") {
              return (
                <ChallengeCard
                  key={index}
                  challenge={challenge}
                  onViewDetails={() => setSelectedChallenge(challenge)}
                  onReject={handleReject}
                  inviterView
                />
              );
            }
            return (
              <ChallengeCard
                key={index}
                challenge={challenge}
                onViewDetails={() => setSelectedChallenge(challenge)}
                onAccept={handleAccept}
                onReject={handleReject}
                invitedView
              />
            );
          })}
        </div>
        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              قبلی
            </button>
            <span className="px-3 py-1 font-bold">
              صفحه {currentPage} از {totalPages}
            </span>
            <button
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
            >
              بعدی
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default ChallengeSection;
