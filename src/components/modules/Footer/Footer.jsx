import Link from 'next/link';
import { FaInstagram, FaTelegram, FaDiscord, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="dark:bg-gray-800 dark:text-white bg-white  text-gray-700 py-12">
      <div className=" mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
         
          <div>
            <h3 className="font-inter text-xl font-bold   text-orange-600  mb-4 dark:text-gold dark:[text-shadow:_0_0_5px_#d19a1e] [text-shadow:_0_0_5px_#FF6200] ">
              درباره گیم‌نت 4K
            </h3>
            <p className=" text-sm leading-relaxed">
              گیم‌نت 4K، بهترین مقصد برای گیمرهای حرفه‌ای! تجربه بازی با کنسول‌های نسل جدید، تورنمنت‌های هیجان‌انگیز، و فضای گیمینگ نئون.
            </p>
          </div>

          <div>
            <h3 className="font-inter text-xl font-bold text-orange-600  mb-4 dark:text-gold dark:[text-shadow:_0_0_5px_#d19a1e] [text-shadow:_0_0_5px_#FF6200] ">
              لینک‌های سریع
            </h3>
            <ul className="text-sm space-y-2">
              <li>
                <Link
                  href="/products"
                  className="hover:text-orange-600 dark:hover:text-gold dark:hover:[text-shadow:_0_0_5px_#d19a1e]   transition duration-300 hover:[text-shadow:_0_0_5px_#FF6200] "
                >
                  محصولات
                </Link>
              </li>
              <li>
                <Link
                  href="/tournaments"
                  className="hover:text-orange-600 dark:hover:text-gold dark:hover:[text-shadow:_0_0_5px_#d19a1e] transition duration-300 hover:[text-shadow:_0_0_5px_#FF6200] "
                >
                  تورنمنت‌ها
                </Link>
              </li>
              <li>
                <Link
                  href="/ranking"
                  className="hover:text-orange-600 dark:hover:text-gold dark:hover:[text-shadow:_0_0_5px_#d19a1e] transition duration-300 hover:[text-shadow:_0_0_5px_#FF6200] "
                >
                  رتبه‌بندی
                </Link>
              </li>
              <li>
                <Link
                  href="/about-us"
                  className="hover:text-orange-600 dark:hover:text-gold dark:hover:[text-shadow:_0_0_5px_#d19a1e] transition duration-300 hover:[text-shadow:_0_0_5px_#FF6200]"
                >
                  درباره ما
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className=" text-xl font-bold dark:text-gold dark:[text-shadow:_0_0_5px_#d19a1e] dark:hover:text-gold dark:hover:[text-shadow:_0_0_5px_#d19a1e] text-orange-600  mb-4 [text-shadow:_0_0_5px_#FF6200] ">
              تماس با ما
            </h3>
            <ul className="font-vazir text-sm space-y-2">
              <li>آدرس: اصفهان، خیابان گیمرها، پلاک ۴K</li>
              <li>تلفن: ۰۲۱-۴۴۴۴۴۴۴۴</li>
              <li>ایمیل: info@club4k.ir</li>
            </ul>
          </div>

          <div>
            <h3 className=" text-xl font-bold text-orange-600 dark:[text-shadow:_0_0_5px_#d19a1e] dark:text-gold mb-4 [text-shadow:_0_0_5px_#FF6200] ">
              ما رو دنبال کن
            </h3>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/club4k"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl hover:text-purple-600  transition duration-300 hover:[text-shadow:_0_0_5px_#FF6200]"
              >
                <FaInstagram />
              </a>
              <a
                href="https://t.me/club4k"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl hover:text-blue-600  transition duration-300 hover:[text-shadow:_0_0_5px_#FF6200]"
              >
                <FaTelegram />
              </a>
              <a
                href="https://discord.gg/club4k"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl hover:text-orange-600  transition duration-300 hover:[text-shadow:_0_0_5px_#FF6200] "
              >
                <FaDiscord />
              </a>
              <a
                href="https://youtube.com/club4k"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl hover:text-red-600 transition duration-300 hover:[text-shadow:_0_0_5px_#FF6200] "
              >
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>

        {/* کپی‌رایت */}
        <div className="mt-12 pt-8 border-t border-gray-200  text-center">
          <p className=" text-sm">
            &copy; ۲۰۲۵ گیم‌نت 4K. تمامی حقوق محفوظ است.
          </p>
        </div>
      </div>
    </footer>
  );
}