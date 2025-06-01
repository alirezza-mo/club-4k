import Navbar from "@/components/modules/Navbar/Navbar";
import Header from "@/components/templates/index/Header/Header";


export default function Home() {
  return (
   <>
    <main className="relative flex flex-col items-center bg-gray-300" >
        <Navbar/>
        <Header/>
      <div className = 'container'>
      </div>
    </main>
   </>
  );
}
