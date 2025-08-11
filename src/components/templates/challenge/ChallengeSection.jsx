"use client"
import React, { useEffect, useState } from "react";
import ChallengeForm from "./ChallengeForm";
import ChallengeCard from "./ChallengeCard";

function ChallengeSection() {
  const [challenges, setChallenges] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");

  const fetchData = async () => {
    setIsLoading(true);
   
    
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChallengeCreated = (newChallenge) => {
    setChallenges((prev) => [...prev, newChallenge]);
  };

  const handleAccept = (challenge) => {
    setChallenges((prev) =>
      prev.map((c) =>
        c.id === challenge.id ? { ...c, status: "accepted" } : c
      )
    );
  };

  const handleReject = (challenge) => {
    setChallenges((prev) =>
      prev.map((c) =>
        c.id === challenge.id ? { ...c, status: "rejected" } : c
      )
    );
  };

  const handleCancel = (challenge) => {
    setChallenges((prev) => prev.filter((c) => c.id !== challenge.id));
  };

  const filteredChallenges = statusFilter
    ? challenges.filter((challenge) => challenge.status === statusFilter)
    : challenges;
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onViewDetails={() => setSelectedChallenge(challenge)}
              onAccept={handleAccept}
              onReject={handleReject}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default ChallengeSection;
