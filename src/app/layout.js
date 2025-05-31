
import "./globals.css";
import {Vazirmatn , Orbitron} from 'next/font/google'

const vazir = Vazirmatn({
  subsets: ["arabic"] , 
  weight : ["400" , "700"] , 
  variable : '--font-vazir' ,
  display : "swap"
}) 
const orbitron = Orbitron({
  subsets: ["latin"] , 
  weight : ["400" , "700"] , 
  variable : '--font-orbitron' ,
  display : "swap"
}) 
export const metadata = {
  title : "وبسایت گیم نت 4K"
}
export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" className= {`${vazir.variable} ${orbitron.variable}`}>
      <body className="font-vazir" >
        {children}
      </body>
    </html>
  );
}
