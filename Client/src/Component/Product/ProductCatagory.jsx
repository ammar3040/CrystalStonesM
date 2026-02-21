import React, { useState, useEffect } from 'react';
import CategoryCard, { CategoryCardSkeleton } from "./CatagoryCard";
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import axios from 'axios';
import { Diamond } from 'lucide-react';


function ProductCategory() {
  const [catagory, setCatagory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setLoading(true);
    axios.get(`${import.meta.env.VITE_API_URL}/api/getCatagory`)
      .then((res) => {
        setCatagory(res.data);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Split categories into two rows
  const midpoint = Math.ceil(catagory.length / 2);
  const row1 = catagory.slice(0, midpoint);
  const row2 = catagory.slice(midpoint);

  const SectionHeader = () => (
    <div className="flex flex-col items-center mb-10">
      <div className="flex items-center gap-4 mb-2">
        <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-amber-500" />
        <Diamond size={16} className="text-amber-500 fill-amber-500/20" />
        <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-amber-500" />
      </div>
      <h2 className="text-2xl sm:text-4xl font-black text-gray-900 uppercase tracking-tighter text-center">
        Shop by Category
      </h2>
      <p className="text-zinc-500 text-[10px] sm:text-xs mt-2 tracking-[0.3em] uppercase font-bold text-center">
        Handcrafted natural treasures
      </p>
    </div>
  );

  const swiperCommonProps = {
    freeMode: true,
    speed: 4000,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
    },
    modules: [FreeMode, Autoplay],
    className: "catagory-swiper",
  };

  return (
    <div className="max-w-[1400px] mx-auto py-12 px-4 sm:px-6">
      <SectionHeader />

      {loading ? (
        <div className="flex flex-wrap justify-center gap-6">
          {[...Array(isMobile ? 4 : 8)].map((_, i) => <CategoryCardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Row 1: Scrolls Right → Left (default direction) */}
          <Swiper
            {...swiperCommonProps}
            slidesPerView="auto"
            spaceBetween={16}
            loop={row1.length > 3}
          >
            {row1.map((c, index) => (
              <SwiperSlide key={`r1-${index}`} style={{ width: 'auto' }}>
                <div className="py-2">
                  <CategoryCard category={c} index={index} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Row 2: Scrolls Left → Right (reverse direction) */}
          {row2.length > 0 && (
            <Swiper
              {...swiperCommonProps}
              slidesPerView="auto"
              spaceBetween={16}
              loop={row2.length > 3}
              autoplay={{
                delay: 0,
                disableOnInteraction: false,
                reverseDirection: true,
              }}
            >
              {row2.map((c, index) => (
                <SwiperSlide key={`r2-${index}`} style={{ width: 'auto' }}>
                  <div className="py-2">
                    <CategoryCard category={c} index={index} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductCategory;