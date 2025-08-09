"use client";
import React, { useEffect, useState } from "react";
import SendMessage from "./SendMessage";
import Messages from "./Messages";
import { fetchWithRefresh } from "@/utils/getAccessToken";

function Chat() {
  const [gameNet, setGameNet] = useState("");
  const [gameNetName, setGameNetName] = useState("");
  const [userName , setUserName] = useState("")

  useEffect(() => {
    fetchWithRefresh("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        setGameNetName(data.gameNet) 
        data.userName && setUserName(data.userName)
      })
      .catch((err) => console.error(err));
  }, [gameNetName]);

  return (
    <>
      <section className="w-full flex flex-col items-center mt-20">
        <h4 className="self-start text-xl sm:text-2xl  dark:text-white font-bold flex items-center gap-2 border-b-4 dark:border-gold border-orange-600 pb-2 ">
          تالار گفتگو
        </h4>
        <div className=" m-5 flex items-center justify-center gap-3">
          {gameNetName && (
            <button
              onClick={(e) => setGameNet(e.target.value)}
              value={gameNetName}
              className={` px-8 py-2 bg-gray-300 text-orange-600 rounded-2xl cursor-pointer ${
                gameNet === gameNetName && `bg-orange-600 text-white`
              } hover:bg-orange-600 hover:text-white transition-all `}
            >
              {gameNetName}
            </button>
          )}
          <button
            onClick={(e) => setGameNet(e.target.value)}
            value={"global"}
            className={` px-8 py-2 bg-gray-300 text-orange-600 rounded-2xl cursor-pointer ${
              gameNet === "global" && `bg-orange-600 text-white`
            } hover:bg-orange-600 hover:text-white transition-all`}
          >
            {" "}
            گلوبال{" "}
          </button>
        </div>
        <div className="w-full rounded-2xl bg-white dark:bg-black my-5 p-2">
          <Messages gameNetName={gameNetName} gameNet = {gameNet} userName = {userName} />
          <SendMessage />
        </div>
      </section>
    </>
  );
}

export default Chat;
