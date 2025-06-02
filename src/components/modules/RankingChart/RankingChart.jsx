// app/components/Leaderboard.tsx
"use client";

import { useEffect, useState } from "react";
import { FaTrophy } from "react-icons/fa";

export default function RankingChart() {
  const [displayCount, setDisplayCount] = useState(10);
  const players = [
    { rank: 1, name: "علی گیمر", score: 9500 },
    { rank: 2, name: "رضا پرو", score: 9200 },
    { rank: 3, name: "مریم شوتر", score: 9000 },
    { rank: 4, name: "حسین اسنایپر", score: 8500 },
    { rank: 5, name: "نیما نینجا", score: 8200 },
    { rank: 6, name: "سارا گیمر", score: 8000 },
    { rank: 7, name: "مهدی پرو", score: 7800 },
    { rank: 8, name: "آتنا جنگجو", score: 7500 },
    { rank: 9, name: "امیر کاپیتان", score: 7200 },
    { rank: 10, name: "کیانوش قهرمان", score: 7000 },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setDisplayCount(5);
      } else {
        setDisplayCount(10);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="py-12">
      <div className=" mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-orange-600">
          برگزیدگان بازی های فوتبال
        </h2>
        <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {players.slice(0, displayCount).map((player, index) => (
            <div
              key={index}
              className={`rounded-lg text-center transform transition-transform hover:scale-105 bg-[url(/images/user.jpg)] bg-cover bg-center  ${
                index === 0
                  ? "text-white "
                  : index === 1
                  ? "bg-gray-500  text-white  "
                  : index === 2
                  ? "bg-amber-700  text-white "
                  : " text-gray-600"
              }`}
            >
              <div
                className={`w-full h-full bg-linear-to-r from-white/30 to-black/20 p-6 rounded-lg
                ${
                  index === 0
                    ? "bg-linear-to-r from-yellow-300/20 to-yellow-300/40 hover:bg-black text-white "
                    : index === 1
                    ? "bg-linear-to-r from-gray-600/20 to-gray-600/40 hover:bg-black text-white  "
                    : index === 2
                    ? "bg-linear-to-r from-orange-600/20 to-orange-600/40 hover:bg-black text-white "
                    : " text-gray-300"
                }
                `}
              >
                <div className="flex justify-center items-center mb-2">
                  {index < 3 ? (
                    <span className="text-3xl mr-2">
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                    </span>
                  ) : (
                    <FaTrophy className="text-2xl mr-2 text-orange-600" />
                  )}
                  <span className=" text-lg text-orange-600 ">
                    {index < 3 ? "" : `رتبه ${player.rank}`}
                  </span>
                </div>
                <h3 className=" text-xl font-bold">{player.name}</h3>
                <p className=" text-sm">امتیاز: {player.score}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
