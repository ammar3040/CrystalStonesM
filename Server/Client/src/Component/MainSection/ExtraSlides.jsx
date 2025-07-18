import React from 'react';
import { Link } from 'react-router-dom';

function ExtraSlides({ bgImg, productName, category, productId, index, description }) {
  return (
    <section className='relative w-full h-full'>
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        
      ></div>
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
      
      {/* Content container */}
      <div className="relative z-10 w-full h-full flex items-center justify-center px-4 sm:px-8 lg:px-16">
        <div className="container mx-auto">
          {/* Changed to only stack on mobile (below md breakpoint) */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-12 xl:gap-16">
            {/* Product Image */}
            <div className="md:w-1/2 flex justify-center">
              <img
                src={bgImg}
                className="w-[220px] sm:w-[280px] md:w-full max-w-[320px] rounded-2xl border-[3px] border-white/20 shadow-xl transition-transform duration-300 hover:scale-105"
                alt={`${productName} - ${category}`}
              />
            </div>
            
            {/* Text content */}
            <div className="md:w-1/2 text-center md:text-left px-4">
              {/* Product Name with truncation */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 line-clamp-2">
                {productName}
              </h1>
              
              {/* Description with truncation */}
              <p className="text-sm sm:text-base md:text-lg text-gray-200 line-clamp-3">
                {description}
              </p>
              
              {/* View More Button */}
              <Link to={`/catagory/${category}`}>
                <button className="btn btn-primary text-sm sm:text-base">
                  View More
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ExtraSlides;