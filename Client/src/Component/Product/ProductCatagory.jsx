import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/autoplay'; // Don't forget to import autoplay CSS
import { FreeMode, Pagination, Autoplay } from 'swiper/modules'; // Add Autoplay to imports
import { Link } from 'react-router-dom';

export default function ProductCatagory() {
 const products = [
    { id: 1, img: "/img/ProductBraclate.webp", name: "bracelet", category: "bracelets" },
    { id: 2, img: "/img/ProdcutCrystalAngle.webp", name: "crystal-angle", category: "angle" },
    { id: 3, img: "/img/ProductCrystalTree.webp", name: "crystal-tree", category: "decor" },
    { id: 4, img: "/img/ProductPendulum.webp", name: "pendulum", category: "pendulum" },
    { id: 5, img: "/img/ProductWorryStone.webp", name: "worry-stone", category: "stones" },
  ];


    return (
        <>
            <Swiper
                slidesPerView={4}
                spaceBetween={0}
                freeMode={true}
                loop={true}
                speed={2000} // Adjust transition speed
                autoplay={{
                    delay: 1, // Minimal delay
                    disableOnInteraction: false,
                    pauseOnMouseEnter: false, // Continue even when mouse hovers
                    waitForTransition: false // Don't wait for transition to complete
                }}
                pagination={{
                    clickable: true,
                }}
                modules={[FreeMode, Pagination, Autoplay]} // Add Autoplay module
                className="mySwiper"
                style={{
                    margin: "40px 0",
                   
                    padding: "0 20px"
                }}
            >
             {products.map((product) => (
        //         <Link 
        //     to={`/category/${product.category}`} 
        //     key={product.id}
        //     className="flex-shrink-0 w-1/4 p-4 hover:scale-105 transition-transform duration-300"
        //   >
                    <SwiperSlide 
                        key={product.id}
                        style={{
                            backgroundColor: "white",
                            margin: "0 !important",
                            width: "20%",
                            padding: "0",
                        }}
                         breakpoints={{
              320: {
                slidesPerView: 2 ,
                
                centeredSlides: true
              },
              480: {
                slidesPerView: 2,
             
              },
              640: {
                slidesPerView: 3,
              
              }
            }}
                    >
                        <Link to={"/catagory/"+product.category}>
                        <img 
                            src={product.img} 
                            alt="" 
                            style={{
                                objectFit: "contain",
                                height: "100%",
                                width: "90%",
                                display: "block"
                            }}
                        />
                        </Link>
                    </SwiperSlide>
              
                ))}
            </Swiper>
        </>
    );
}