import Navbar from "@/components/modules/Navbar/Navbar";
import Header from "@/components/templates/index/Header/Header";


export default function Home() {
  return (
   <>
    <main>
      <div className = 'container'>
        <Navbar/>
        <Header/>
      </div>
    </main>
   </>
  );
}
