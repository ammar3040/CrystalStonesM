import React, { useState, useEffect } from 'react';
import CategoryCard from "./CatagoryCard";
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import axios from 'axios';


function ProductCategory() {
  const [catagory,setCatagory]=useState([]);


  const [visibleCards, setVisibleCards] = useState(10);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // 768px is typically 'md' breakpoint
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadMore = () => {
    setVisibleCards(prev => prev + (isMobile ? 3 : 5));
  };
  
  useEffect(() => {


    axios.get(`${import.meta.env.VITE_API_URL}/api/getCatagory`)
      .then((res) => {
        setCatagory(res.data); // store product data
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }, []);

  // Mobile view - Grid cards
  if (!isMobile) {
    return (

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h2 
  style={{
    textAlign: 'center',
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#2d3748',
    margin: '40px 0 30px',
    paddingBottom: '15px',
    position: 'relative',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  }}
>
  Our Product Categories
  <span 
    style={{
      content: '""',
      position: 'absolute',
      bottom: '0',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '80px',
      height: '4px',
      backgroundColor: 'rgba(255, 248, 168, 0.7)',
      borderRadius: '2px'
    }}
  ></span>
</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '20px',
          padding: '20px'
        }}>
          {catagory.slice(0, visibleCards).map((c, index) => (
            <CategoryCard category={c} />

          ))}
        </div>

        {visibleCards < catagory.length && (
          <div style={{ textAlign: 'center', margin: '30px 0' }}>
            <button 
              onClick={loadMore}
              style={{
                padding: '12px 30px',
                backgroundColor: '#4a90e2',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#3a7bc8';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#4a90e2';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
              }}
            >
              Load More
            </button>
          </div>
        )}
      </div>
    );
  }

  // Desktop/tablet view - Swiper slider
  return (
    <div style={{ maxWidth: '1400px', margin: '40px auto', padding: '0 20px' }}>
      <Swiper
        slidesPerView={3}
        spaceBetween={2}
        freeMode={true}
        loop={true}
        speed={2000}
        autoplay={{
          delay: 1,
          disableOnInteraction: false,
        }}
        modules={[FreeMode, Autoplay]}
        breakpoints={{
           320: {
            slidesPerView: 2 ,spaceBetween: 1, centeredSlides: true
        },

          640: {
            slidesPerView: 3,
            spaceBetween: 2}
            
        }}
      >
        {catagory.map((c, index) => (
          <SwiperSlide key={index}>
            <div style={{ padding: '10px' }}>
          
  <CategoryCard category={c} />



            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default ProductCategory;