"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function RankingChart() {
  const [displayCount, setDisplayCount] = useState(10);
  const [users, setUsers] = useState([]);

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

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        
        const sorted = [...data].sort((a, b) => (b.xp || 0) - (a.xp || 0));
        const ranked = sorted.map((user, index) => ({
          ...user,
          rank: index + 1,
        }));
        setUsers(ranked);
      });
  }, []);
  
  return (
    <section className="py-12">
      <div className="mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-orange-600 dark:text-gold">
          برگزیدگان PES | FIFA
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.slice(0, displayCount).map((player, index) => {
            const isTop = index < 3;
            const rankLabel =
              index === 0
                ? "🥇"
                : index === 1
                ? "🥈"
                : index === 2
                ? "🥉"
                : `رتبه ${player.rank}`;

            // حلقه رنگی ویژه برای سه نفر اول
            const ringClass =
              index === 0
                ? "ring-4 ring-yellow-300/60"
                : index === 1
                ? "ring-4 ring-gray-300/60"
                : index === 2
                ? "ring-4 ring-orange-400/60"
                : "";

            return (
              <div
                key={player._id}
                className={`pt-10 relative bg-gradient-to-br from-white/60 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:-translate-y-1`}
              >
                <div className="absolute left-3 top-3 z-10">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold text-white
                      ${
                        index === 0
                          ? "bg-yellow-500"
                          : index === 1
                          ? "bg-gray-500"
                          : index === 2
                          ? "bg-orange-600"
                          : "bg-orange-400"
                      }`}
                    title={
                      isTop
                        ? ["اول", "دوم", "سوم"][index] || ""
                        : `رتبه ${player.rank}`
                    }
                  >
                    {isTop ? rankLabel : player.rank}
                  </div>
                </div>

                <div className="flex justify-center pt-6">
                  <div className={`relative -mt-12 ${ringClass} rounded-full`}>
                    <Image
                      src={
                        player.avatar
                          ? `${process.env.GET_LIARA}/${player?.avatar}`
                          : `/images/unknown.jpg`
                      }
                      height={96}
                      width={96}
                      alt={player?.userName || "profile"}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white dark:border-gray-800 shadow-md"
                    />
                    {
                      console.log(player)
                      
                    }
                    
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0 text-center">
                  <Link
                    href={`/profile/${player._id}`}
                    className="block text-lg font-bold text-gray-800 dark:text-white hover:underline"
                  >
                    {player.userName}
                  </Link>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    امتیاز:{" "}
                    <span className="font-semibold text-orange-600">
                      {player.xp || 0}
                    </span>
                  </p>

                  <div className="mt-4 flex justify-center gap-3">
                    <Link
                      href={`/profile/${player._id}`}
                      className="text-xs px-3 py-1 rounded-full bg-orange-100 text-orange-700 hover:bg-orange-200"
                    >
                      مشاهده پروفایل
                    </Link>
                    <button className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200">
                      امتیازات بیشتر
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
