import React, { useState, useEffect } from 'react';
import CategoryCard from "./CatagoryCard";
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import axios from 'axios';


function ProductCategory() {
  const [catagory,setCatagory]=useState([]);


  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // 768px is typically 'md' breakpoint
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


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
  Shop by Category
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
        {catagory.map((c, index) => (
  <CategoryCard key={index} category={c} />
))}

        </div>

  
      </div>
    );
  }

  // Desktop/tablet view - Swiper slider
  return (
    <div style={{ maxWidth: '1400px', margin: '40px auto', padding: '0 20px' }}>
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
 Shop by Category
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
          <SwiperSlide >
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