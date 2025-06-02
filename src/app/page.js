import Navbar from "@/components/modules/Navbar/Navbar";
import Challenge from "@/components/templates/index/Challenge/Challenge";
import Gallery from "@/components/templates/index/Gallery/Gallery";
import Header from "@/components/templates/index/Header/Header";
import Leaderboard from "@/components/templates/index/Leaderboard/Leaderboard";
import News from "@/components/templates/index/News/News";
import Ranking from "@/components/templates/index/Ranking/Ranking";


export default function Home() {
  return (
   <>
    <main className="relative flex flex-col items-center bg-emerald-50" >
        <Navbar/>
        <Header/>
      <div className = 'container'>
        <Leaderboard/>
        <Ranking/>
        <Challenge/>
        <Gallery/>
        <News/>
      </div>
    </main>
   </>
  );
}
