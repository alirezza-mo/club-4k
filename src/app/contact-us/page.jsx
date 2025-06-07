import Footer from "@/components/modules/Footer/Footer";
import Navbar from "@/components/modules/Navbar/Navbar";
import ContactForm from "@/components/templates/contactus/ContactForm";
import React from "react";
import { FaEnvelope, FaInstagram, FaPhone, FaTelegram, FaWhatsapp } from "react-icons/fa";

function page() {

  
  return (

    <>
      <main className="relative dark:bg-black/90">
        <Navbar />
        <div className="container">
          <section className="mt-28 mx-auto px-4">
            <h1 className="font-inter text-4xl font-bold text-center text-orange-600 dark:text-yellow-400 text-shadow-yellow-glow mb-4 animate-fadeIn">
              ارتباط با گیم‌نت 4K
            </h1>
            <p className="font-vazir text-center text-gray-700 dark:text-gray-200 mb-8 animate-fadeIn">
              با ما در تماس باش برای سوالات، انتقادات یا همکاری!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="animate-fadeIn">
                <ContactForm />
              </div>
              <div className="flex flex-col justify-center animate-fadeIn">
                <h2 className="font-vazir text-2xl font-bold text-orange-600 dark:text-yellow-400 mb-4">
                  اطلاعات تماس
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-orange-600 dark:text-yellow-400 w-6 h-6" />
                    <a
                      href="mailto:support@club4k.com"
                      className="font-vazir text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-yellow-400 transition duration-300"
                    >
                      support@club4k.com
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaPhone className="text-orange-600 dark:text-yellow-400 w-6 h-6" />
                    <a
                      href="tel:+989123456789"
                      className=" font-vazir text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-yellow-400 transition duration-300"
                    >
                      1996 676 0913
                    </a>
                  </div>
                  <div className="flex items-center gap-4">
                    <a
                      href="https://instagram.com/club4k"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-600 dark:text-yellow-400 hover:scale-110 transition duration-300"
                    >
                      <FaInstagram className="w-8 h-8 hover:text-red-600" />
                    </a>
                    <a
                      href="https://t.me/club4k"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-600 dark:text-yellow-400 hover:scale-110 transition duration-300"
                    >
                      <FaTelegram className="w-8 h-8 hover:text-blue-600" />
                    </a>
                    <a
                      href="https://discord.gg/club4k"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-600 dark:text-yellow-400 hover:scale-110 transition duration-300"
                    >
                      <FaWhatsapp className="w-8 h-8 hover:text-green-600 " />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </main>
    </>
  );
}

export default page;
