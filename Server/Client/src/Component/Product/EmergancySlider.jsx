import React from 'react'

function EmergancySlider() {
  return (
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
  )
}

export default EmergancySlider