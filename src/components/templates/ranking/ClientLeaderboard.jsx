"use client";

import { useState, useMemo } from "react";
import LeaderboardCard from "@/components/templates/ranking/RankBox";
import SelectDropdown from "@/components/templates/ranking/SelectDropDown";
import RankFilterSelect from "@/components/templates/ranking/RankFilter";

export default function ClientLeaderboard({ initialUsers }) {
  const [selectedGym, setSelectedGym] = useState("all");
  const [selectedFilter, setSelectedFilter] = useState("بیشترین امتیاز");

  const options = [
    { label: "همه گیم نت ها", value: "all" },
    { label: "4K", value: "4K" },
    { label: "dragon club", value: "dragon" },
    { label: "gameLand", value: "gameLand" },
  ];

  const optionsFilter = [
    { id: 1, label: "بیشترین امتیاز" },
    { id: 2, label: "کمترین امتیاز" },
  ];

  const filteredUsers = useMemo(() => {
    let data = [...initialUsers];
    
    if (selectedGym !== "all") {
      data = data.filter(u => u.gameNet == selectedGym);
    }

    if (selectedFilter === "بیشترین امتیاز") {
      data.sort((a, b) => b.xp - a.xp);
    } else if (selectedFilter === "کمترین امتیاز") {
      data.sort((a, b) => a.xp - b.xp);
    }

    console.log(data);
    

    return data;
  }, [initialUsers, selectedGym, selectedFilter]);
  
  return (
    <div className="container flex flex-col gap-10 items-center justify-center">
      <div className="flex lg:flex-row flex-col items-start">
        <div className="flex flex-col gap-10 w-80 mt-52 lg:mt-32">
          <SelectDropdown
            title="جستجو در گیم نت ها"
            options={options}
            onSelectChange={setSelectedGym}
          />
          <RankFilterSelect
            title="چینش بر اساس"
            optionsFilter={optionsFilter}
            onFilterChange={setSelectedFilter}
          />
        </div>

        <div className="w-full flex flex-wrap items-center justify-center gap-5 mt-32">
          {filteredUsers.map((player) => (
            <LeaderboardCard
              key={player._id}
              rank={player.rank}
              name={player.userName}
              score={player.xp}
              avatar={player.avatar}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
