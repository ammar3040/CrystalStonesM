import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import ExtraSlides from "./ExtraSlides";
import MainSlides from './MainSlides';
import { motion, AnimatePresence } from 'framer-motion';

export default function MainSection() {
  const [randomProducts, setRandomProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/all?limit=12`);
        const data = await response.json();
        const products = data.products || [];

        if (Array.isArray(products)) {
          const shuffled = shuffleArray(products);
          setRandomProducts(shuffled.slice(0, 6));
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  return (
    <div className="relative w-full bg-zinc-950">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-[75vh] sm:h-[65vh] bg-zinc-900 flex items-center justify-center"
          >
            <div className="relative flex flex-col items-center">
              <div className="w-12 h-12 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
              <div className="mt-4 text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Loading Treasures</div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Swiper
              modules={[Pagination, Navigation, Autoplay]}
              spaceBetween={0}
              slidesPerView={1}
              pagination={{ el: '.custom-pagination', clickable: true }}
              navigation={{ nextEl: '.custom-next', prevEl: '.custom-prev' }}
              autoplay={{ delay: 6000, disableOnInteraction: false }}
              className="w-full h-[85vh] sm:h-[70vh] lg:h-[75vh]"
              style={{
                backgroundImage: "url(https://res.cloudinary.com/dioicxwct/image/upload/v1753539191/hmhyu80yzltr0lahjlli_i1gjpl.jpg)",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            >


              {/* Main static slide */}
              <SwiperSlide>
                <MainSlides />
              </SwiperSlide>

              {/* Dynamic product slides */}
              {randomProducts.map((product, index) => (
                <SwiperSlide key={product._id || index}>
                  <ExtraSlides
                    bgImg={product.mainImage?.url}
                    productName={product.productName}
                    description={product.description}
                    category={decodeURIComponent(product.category)}
                    productId={product._id}
                    index={index}
                  />
                </SwiperSlide>
              ))}

              {/* Navigation Buttons — Crystal Style */}
              <button className="custom-prev absolute left-4 top-1/2 -translate-y-1/2 z-30 w-14 h-14 flex items-center justify-center text-white/70 hover:text-amber-400 transition-colors hidden sm:flex group">
                <div className="absolute inset-0 border-2 border-white/20 group-hover:border-amber-400/60 rotate-45 transition-all rounded-sm" />
                <svg className="relative w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button className="custom-next absolute right-4 top-1/2 -translate-y-1/2 z-30 w-14 h-14 flex items-center justify-center text-white/70 hover:text-amber-400 transition-colors hidden sm:flex group">
                <div className="absolute inset-0 border-2 border-white/20 group-hover:border-amber-400/60 rotate-45 transition-all rounded-sm" />
                <svg className="relative w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
              </button>
            </Swiper>

            {/* Pagination — Crystal Dots */}
            <div className="custom-pagination absolute bottom-8 left-0 w-full flex justify-center z-30 space-x-3"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Crystal Pagination Styling */}
      <style jsx="true">{`
        .custom-pagination .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #fff;
          opacity: 0.3;
          border-radius: 2px;
          transform: rotate(45deg);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: pointer;
        }
        .custom-pagination .swiper-pagination-bullet-active {
          background: #f59e0b; /* amber-500 */
          opacity: 1;
          transform: rotate(45deg) scale(1.8);
          box-shadow: 0 0 15px rgba(245, 158, 11, 0.5);
        }
        @media (max-width: 768px) {
          .custom-pagination .swiper-pagination-bullet {
            width: 6px;
            height: 6px;
          }
        }
      `}</style>
    </div>
  );
}
