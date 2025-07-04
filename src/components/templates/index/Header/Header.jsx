import Link from "next/link";
import { FaChevronDown } from "react-icons/fa6";

export default function Header() {
  return (
    <>
      <section className="relative dark:lg:bg-[url(/images/darkHeader.jpg)] dark:bg-[url(/images/darkHeader-mobile.jpg)]  bg-[url(/images/header2.jpg)] lg:bg-[url(/images/header1.jpg)] w-full h-screen bg-center bg-cover bg-no-repeat flex items-center sm:items-end  lg:justify-end">
        <h1 className="text-center z-10 leading-10 xl:leading-16 xl:text-6xl xl:w-[680px] xl:px-16  lg:text-4xl lg:w-[500px] lg:px-8 text-xl w-[210px] p-3 sm:text-3xl sm:[600px] sm:px-4 sm:py-16 backdrop-blur-lg lg:backdrop-blur-2xl mb-4 mt-10 mx-2 rounded-4xl font-extrabold text-gray-200 lg:text-gray-300 lg:bg-black/50 ">
          {" "}
          هر مسابقه یک نبرد ، هر نبرد یک قهرمان{" "}
        </h1>
        <Link href={"#leaderboard"}>
          <FaChevronDown className="absolute bottom-6 left-[50%] text-3xl lg:text-5xl text-white transition-all animate-bounce " />
        </Link>
        {/* <h1 className="font-orbitron backdrop-blur-2xl py-24 px-16 mb-52 ml-2 rounded-4xl text-6xl font-extrabold w-[700px] text-gray-900  "> EVERY GAME A BATTLE AND EVERY BATTLE A CHAMPION </h1> */}
      </section>
    </>
  );
}
