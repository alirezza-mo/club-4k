
import "./globals.css";
import { Vazirmatn } from "next/font/google";

const vazir = Vazirmatn({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-vazir",
  display: "swap",
});

export const metadata = {
  title: "وبسایت گیم نت 4K",
};
export default async function RootLayout({ children }) {


  return (
    <html
      lang="fa"
      dir="rtl"
      className={` ${vazir.variable} font-sans  scroll-smooth `}
    >
      {/* <ThemeScript> */}
      <body className="font-vazir">{children}</body>
      {/* </ThemeScript> */}
    </html>
  );
}
