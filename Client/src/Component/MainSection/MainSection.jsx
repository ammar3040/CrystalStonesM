import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import ExtraSlides from "./ExtraSlides";
import MainSlides from './MainSlides';

export default function MainSection() {
  const [randomProducts, setRandomProducts] = useState([]);

  const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/all`);
        const data = await response.json();

        if (Array.isArray(data)) {
          const shuffled = shuffleArray(data);
          const selected = shuffled.slice(0, 6);
          setRandomProducts(selected);
        } else {
          console.error('Invalid product data:', data);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    fetchAllProducts();
  }, []);

  return (
    <div className="relative w-full">
      <Swiper
        modules={[Pagination, Navigation, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{ el: '.custom-pagination', clickable: true }}
        navigation={{ nextEl: '.custom-next', prevEl: '.custom-prev' }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        className="w-full h-[75vh] sm:h-[60vh]"
        style={{
          backgroundImage: "url(https://res.cloudinary.com/dioicxwct/image/upload/v1751947665/HERO_slider_2_bhtzay.jpg)",
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
              category={product.category}
              productId={product._id}
              index={index}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Pagination */}
      <div className="custom-pagination absolute bottom-4 left-0 w-full flex justify-center z-10 space-x-2"></div>

      {/* Style */}
      <style jsx="true">{`
        .custom-pagination .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: #000;
          opacity: 0.5;
          border-radius: 9999px;
          transition: all 0.3s ease;
        }
        .custom-pagination .swiper-pagination-bullet-active {
          background: #D4AF37;
          opacity: 1;
          transform: scale(1.2);
        }
        @media (max-width: 768px) {
          .custom-pagination .swiper-pagination-bullet {
            width: 10px;
            height: 10px;
          }
        }
      `}</style>
    </div>
  );
}
