import Image from "next/image";

export default function Header() {
  return (
    <>
      <section className="2xl:w-[1520px] bg-[url(/images/header2.jpg)] lg:bg-[url(/images/header1.jpg)] w-full h-screen bg-center bg-cover bg-no-repeat flex items-end  lg:justify-end">
        <h1 className="text-center z-10 leading-16 xl:text-6xl xl:w-[700px] xl:px-16  lg:text-4xl lg:w-[500px] lg:px-8 text-xl w-[300px] p-5 sm:text-3xl sm:[600px] sm:px-4 sm:py-16 backdrop-blur-3xl lg:backdrop-blur-2xl mb-4 mt-10 mx-2 rounded-4xl font-extrabold text-gray-300 lg:text-gray-300 bg-black/50 ">
          {" "}
          هر مسابقه یک نبرد و هر نبرد یک قهرمان{" "}
        </h1>
        {/* <h1 className="font-orbitron backdrop-blur-2xl py-24 px-16 mb-52 ml-2 rounded-4xl text-6xl font-extrabold w-[700px] text-gray-900  "> EVERY GAME A BATTLE AND EVERY BATTLE A CHAMPION </h1> */}
      </section>
    </>
  );
}
