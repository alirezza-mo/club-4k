
import Navbar from "@/components/modules/Navbar/Navbar";
import Footer from "@/components/modules/Footer/Footer";
import ChallengeSection from "@/components/templates/challenge/ChallengeSection";
import { cookies } from "next/headers";

export default async function Challenges() {
  
  return (
    <main className=" bg-lime-100 dark:bg-black/90 ">
      <Navbar />
      <section className="container  mx-auto px-4 ">
        <ChallengeSection  />
      </section>
      <Footer />
    </main>
  );
}
