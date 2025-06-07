
'use client';

export default function ChallengeCard({ challenge, onViewDetails, onAccept, onReject, onCancel }) {
  return (
    <article className="relative bg-white dark:bg-gray-800 rounded-lg p-6 mb-4 flex flex-col gap-4 gradient-border-card shadow-yellow-glow hover:shadow-bronze-glow transform transition duration-300 hover:scale-105 animate-fadeIn">
      <div className="absolute inset-0 rounded-lg gradient-border-card" />
      <h3 className="font-vazir text-xl font-bold text-orange-600 dark:text-yellow-400 text-shadow-yellow-glow">
        {challenge.opponent}
      </h3>
      <p className="font-inter text-gray-700 dark:text-gray-200">
        بازی: <span className="font-bold">{challenge.game}</span>
      </p>
      <p className="font-inter text-gray-700 dark:text-gray-200">
        تاریخ و زمان: <span className="font-bold">{new Date(challenge.dateTime).toLocaleString('fa-IR')}</span>
      </p>
      <p className="font-inter text-gray-700 dark:text-gray-200">
        وضعیت: <span className={`font-bold ${challenge.status === 'pending' ? 'text-yellow-500' : challenge.status === 'accepted' ? 'text-green-500' : 'text-red-500'}`}>
          {challenge.status === 'pending' ? 'در انتظار' : challenge.status === 'accepted' ? 'تأییدشده' : 'ردشده'}
        </span>
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onViewDetails(challenge)}
          className="bg-blue-600 dark:bg-blue-400 text-white dark:text-gray-900 font-vazir px-4 py-2 rounded-lg shadow-yellow-glow hover:shadow-bronze-glow hover:bg-blue-700 dark:hover:bg-blue-500 transition duration-300"
        >
          جزئیات
        </button>
        {challenge.status === 'pending' && onAccept && (
          <button
            onClick={() => onAccept(challenge)}
            className="bg-green-600 dark:bg-green-400 text-white dark:text-gray-900 font-vazir px-4 py-2 rounded-lg shadow-yellow-glow hover:shadow-bronze-glow hover:bg-green-700 dark:hover:bg-green-500 transition duration-300"
          >
            قبول
          </button>
        )}
        {challenge.status === 'pending' && onReject && (
          <button
            onClick={() => onReject(challenge)}
            className="bg-red-600 dark:bg-red-400 text-white dark:text-gray-900 font-vazir px-4 py-2 rounded-lg shadow-yellow-glow hover:shadow-bronze-glow hover:bg-red-700 dark:hover:bg-red-500 transition duration-300"
          >
            رد
          </button>
        )}
        {challenge.status === 'pending' && onCancel && (
          <button
            onClick={() => onCancel(challenge)}
            className="bg-gray-600 dark:bg-gray-500 text-white dark:text-gray-900 font-vazir px-4 py-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition duration-300"
          >
            زمان دیگر 
          </button>
        )}
      </div>
    </article>
  );
}