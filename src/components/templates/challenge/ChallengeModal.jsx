
'use client';

export default function ChallengeModal({ challenge, onClose }) {
  if (!challenge) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-lg w-full gradient-border-card shadow-yellow-glow animate-fadeIn">
        <h2 className="font-vazir text-2xl font-bold text-orange-600 dark:text-yellow-400 text-shadow-yellow-glow mb-4">
          چلنج با {challenge.opponent}
        </h2>
        <p className="font-inter text-gray-700 dark:text-gray-200 mb-2">
          <strong>بازی:</strong> {challenge.game}
        </p>
        <p className="font-inter text-gray-700 dark:text-gray-200 mb-2">
          <strong>تاریخ و زمان:</strong> {new Date(challenge.dateTime).toLocaleString('fa-IR')}
        </p>
        <p className="font-inter text-gray-700 dark:text-gray-200 mb-2">
          <strong>جایزه:</strong> {challenge.prize || 'بدون جایزه'}
        </p>
        <p className="font-inter text-gray-700 dark:text-gray-200 mb-4">
          <strong>پیام:</strong> {challenge.message || 'بدون پیام'}
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => alert(`تماس با ${challenge.opponent}`)}
            className="bg-green-600 dark:bg-green-400 text-white dark:text-gray-900 font-vazir px-6 py-2 rounded-lg shadow-yellow-glow hover:shadow-bronze-glow hover:bg-green-700 dark:hover:bg-green-500 transition duration-300"
          >
            تماس با حریف
          </button>
          <button
            onClick={onClose}
            className="bg-gray-600 dark:bg-gray-500 text-white dark:text-gray-900 font-vazir px-6 py-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition duration-300"
          >
            بستن
        </button>
        </div>
      </div>
    </div>
  );
}
