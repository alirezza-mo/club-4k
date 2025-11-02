

'use client';

export default function LeaderboardCard({ rank, name, score, avatar }) {
  const getMedal = (rank) => {
    if (rank === 1)
      return <span className=" text-5xl "> 🥇 </span> ;
    if (rank === 2)
      return <span className=" text-5xl "> 🥈 </span>;
    if (rank === 3)
      return <span className=" text-5xl "> 🥉 </span>;
    return <span className="text-2xl font-inter">{rank}</span>;
  };

  const getShadow = (rank) => {
    if (rank === 1) return 'shadow-yellow-glow hover:shadow-yellow-glow';
    if (rank === 2) return 'shadow-bronze-glow hover:shadow-bronze-glow';
    return 'shadow-copper-glow hover:shadow-copper-glow';
  };

  return (
    <div
      className={`relative bg-white dark:bg-gray-800 rounded-lg p-6 mb-4 flex items-center gap-4 gradient-border-card ${getShadow(
        rank
      )} transform transition duration-300 hover:scale-105 animate-fadeIn`}
    >
      
      <div className="absolute inset-0 rounded-lg gradient-border-card" />
     
      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center dark:text-white">
        {getMedal(rank)}
      </div>
      
      <div className="w-16 h-16 rounded-full overflow-hidden shadow-md">
        <img
          src={
                  avatar
                    ? `${process.env.GET_LIARA}/${avatar}`
                    : `/images/unknown.jpg`
                }
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-1">
        <h3 className="font-vazir text-xl font-bold text-orange-600 dark:text-yellow-400 text-shadow-yellow-glow">
          {name}
        </h3>
        <p className="font-inter text-gray-700 dark:text-gray-200">
          امتیاز: <span className="font-bold text-shadow-bronze-glow">{score}</span>
        </p>
      </div>
    </div>
  );
}
