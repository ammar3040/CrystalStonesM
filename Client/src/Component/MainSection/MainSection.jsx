import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import SingleSlide from './SingleSlide';

export default function MainSection() {
  const AllImgpath = [
    "/img/girlWearbracelete.jpeg",
    "/img/BG-crystalTree.jpeg",
    "/img/astroimg.jpeg", // Add more as needed
  ];

  return (
    <div className="relative w-full h-[500px] md:h-[500px] sm:h-[300px]">
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          el: '.custom-pagination',
        }}
        navigation={{
          nextEl: '.custom-next',
          prevEl: '.custom-prev',
        }}
        modules={[Pagination, Navigation, Autoplay]}
        className="h-full w-full"
      >
        {AllImgpath.map((path, index) => (
          <SwiperSlide key={index}>
            <SingleSlide SlideImg={path} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <div className="custom-next absolute top-1/2 right-2 w-10 h-10 -mt-5 z-10 cursor-pointer flex items-center justify-center bg-white bg-opacity-70 rounded-full hover:bg-opacity-90 transition-all duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27 44" className="w-6 h-6">
          <path d="M27,22L5,44l-2.1-2.1L22.8,22L2.9,2.1L5,0L27,22z" fill="#000" />
        </svg>
      </div>
      <div className="custom-prev absolute top-1/2 left-2 w-10 h-10 -mt-5 z-10 cursor-pointer flex items-center justify-center bg-white bg-opacity-70 rounded-full hover:bg-opacity-90 transition-all duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27 44" className="w-6 h-6">
          <path d="M0,22L22,0l2.1,2.1L4.2,22l19.9,19.9L22,44L0,22z" fill="#000" />
        </svg>
      </div>

      {/* Custom Pagination */}
      <div className="custom-pagination absolute bottom-2 left-0 w-full flex justify-center z-10 space-x-2">
        {/* Bullets will be injected here by Swiper */}
      </div>

      {/* Custom styles for pagination bullets that Swiper injects */}
      <style jsx="true">{`
        .custom-pagination .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: #000;
          opacity: 0.5;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .custom-pagination .swiper-pagination-bullet-active {
          opacity: 1;
          background: #D4AF37; /* Light gold color for active bullet */
        }
        
        @media (max-width: 768px) {
          .custom-next,
          .custom-prev {
            width: 8;
            height: 8;
          }
        }
      `}</style>
    </div>
  );
}