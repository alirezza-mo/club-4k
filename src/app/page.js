import Footer from "@/components/modules/Footer/Footer";
import Navbar from "@/components/modules/Navbar/Navbar";
import Challenge from "@/components/templates/index/Challenge/Challenge";
import Comments from "@/components/templates/index/Comments/Comments";
import Gallery from "@/components/templates/index/Gallery/Gallery";
import Header from "@/components/templates/index/Header/Header";
import Leaderboard from "@/components/templates/index/Leaderboard/Leaderboard";
import Motivational from "@/components/templates/index/Motivational/Motivational";
import News from "@/components/templates/index/News/News";
import Products from "@/components/templates/index/Products/Products";
import Ranking from "@/components/templates/index/Ranking/Ranking";


export default function Home() {
  return (
   <>
    <main className="relative flex flex-col items-center bg-lime-100 dark:bg-black/95" >
        <Navbar/>
        <Header/>
      <div className = 'container'>
        <Leaderboard/>
        <Ranking/>
        <Challenge/>
        <Gallery/>
        <News/>
        <Motivational/>
        <Products/>
        <Comments/>
      </div>
      <Footer/>
    </main>
   </>
  );
}
