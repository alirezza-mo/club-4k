
'use client';

import { useState, useEffect } from 'react';
// import LoadingSpinner from '../../components/LoadingSpinner';
import Navbar from '@/components/modules/Navbar/Navbar';
// import ChallengeForm from '@/components/templates/challenge/challengeForm';
import ChallengeCard from '@/components/templates/challenge/ChallengeCard';
import ChallengeModal from '@/components/templates/challenge/ChallengeModal';
import Footer from '@/components/modules/Footer/Footer';
import ChallengeForm from '@/components/templates/challenge/ChallengeForm';

export default function Challenges() {
  const [challenges, setChallenges] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchData = async () => {
    setIsLoading(true);
    // شبیه‌سازی API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const userData = [
      { id: 1, name: 'علیرضا گیمر' },
      { id: 2, name: 'محسن نینجا' },
      { id: 3, name: 'رضا وارزون' },
    ];
    const challengeData = [
      { id: 1, opponent: 'محسن نینجا', game: 'FIFA 23', dateTime: '2023-12-01T18:00', prize: '100,000 تومان', message: 'آماده‌ای؟', status: 'pending' },
      { id: 2, opponent: 'رضا وارزون', game: 'Valorant', dateTime: '2023-12-02T20:00', prize: '', message: 'بزن بریم!', status: 'accepted' },
    ];
    setUsers(userData);
    setChallenges(challengeData);
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
      prev.map((c) => (c.id === challenge.id ? { ...c, status: 'accepted' } : c))
    );
  };

  const handleReject = (challenge) => {
    setChallenges((prev) =>
      prev.map((c) => (c.id === challenge.id ? { ...c, status: 'rejected' } : c))
    );
  };

  const handleCancel = (challenge) => {
    setChallenges((prev) => prev.filter((c) => c.id !== challenge.id));
  };

  const filteredChallenges = statusFilter
    ? challenges.filter((challenge) => challenge.status === statusFilter)
    : challenges;

  return (
   
     
      <main className=" bg-lime-100 dark:bg-black/90 ">
        <Navbar/>
        <section className="container  mx-auto px-4 ">
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
            <ChallengeForm onChallengeCreated={handleChallengeCreated} users={users} />
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
                    // onCancel={handleCancel}
                  />
                ))}
              </div>
            
          </div>
        </section>
        <Footer />
        {selectedChallenge && (
          <ChallengeModal
            challenge={selectedChallenge}
            onClose={() => setSelectedChallenge(null)}
          />
        )}
      </main>
    
  );
}

