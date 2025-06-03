'use client';

import { useRef } from 'react';
import Product from '@/components/modules/Product/Product';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { GiRank3 } from 'react-icons/gi';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/navigation';
import { MdOutlineProductionQuantityLimits } from "react-icons/md";


export default function Products() {
 const products = [
    {
      name: "پلی استیشن 5 اسلیم دیجیتال به همراه دسته اضافه سفید ",
      price: 54000000,
      img: "/images/product.jpg",
      url: "https://technolife.com/ps5",
    },
   {
      name: "پلی استیشن 5 اسلیم دیجیتال به همراه دسته اضافه سفید ",
      price: 54000000,
      img: "/images/product.jpg",
      url: "https://technolife.com/ps5",
    },
   {
      name: "پلی استیشن 5 اسلیم دیجیتال به همراه دسته اضافه سفید ",
      price: 54000000,
      img: "/images/product.jpg",
      url: "https://technolife.com/ps5",
    },
    {
      name: "پلی استیشن 5 اسلیم دیجیتال به همراه دسته اضافه سفید ",
      price: 54000000,
      img: "/images/product.jpg",
      url: "https://technolife.com/ps5",
    },
    {
      name: "پلی استیشن 5 اسلیم دیجیتال به همراه دسته اضافه سفید ",
      price: 54000000,
      img: "/images/product.jpg",
      url: "https://technolife.com/ps5",
    },
  ];

  const formatPrice = (price) => {
    return price.toLocaleString('fa-IR');
  };

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section className="mt-20 w-full">
      <div className="w-full flex justify-between items-center text-xl sm:text-2xl px-4">
        <div className="flex flex-col">
          <h3 className="font-bold flex items-center gap-2 border-none sm:border-b-4 border-orange-600 pb-2 hover:border-none">
            محصولات
            <MdOutlineProductionQuantityLimits />

          </h3>
          <span className="text-xs mt-5">
            تمامی محصولات از فروشگاه تکنولایف هستند.
          </span>
        </div>
        <Link
          href="#"
          className="text-xs sm:text-lg p-1 sm:p-2 rounded-lg bg-orange-600 text-white transition-all hover:bg-transparent active:bg-transparent hover:text-orange-600 active:text-orange-600"
        >
          مشاهده همه ...
        </Link>
      </div>
      <div className="mt-4 px-4 w-full ">
        <div className="flex justify-end gap-2 mb-4">
          <button
            ref={prevRef}
            className="bg-orange-600 text-white p-2 rounded-full hover:bg-orange-500 transition duration-300 block"
          >
            <FaChevronRight className="text-lg" />
          </button>
          <button
            ref={nextRef}
            className="bg-orange-600 text-white p-2 rounded-full hover:bg-orange-500 transition duration-300 block"
          >
            <FaChevronLeft className="text-lg" />
          </button>
        </div>
        <div>
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={20}
            slidesPerView={2}
            breakpoints={{

            
              
              640: { slidesPerView: 3 },

              1024: { slidesPerView: 4 },
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            loop = {true}
            onInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
              swiper.navigation.init();
              swiper.navigation.update();
            }}
            dir="rtl"
            className="mySwiper "
          >
            {products.map((product, index) => (
              <SwiperSlide key={index} className='!mx-3 xl:!mx-0 sm:!mx-10' >
                  <Product
                    name={product.name}
                    price={formatPrice(product.price)}
                    img={product.img}
                    url={product.url}
                  />
                
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

