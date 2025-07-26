import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

function MainSlides() {
  return (
    <section className="relative w-full h-full"> {/* Removed min-height */}
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/50 z-0"></div>

      {/* Content container - now properly constrained */}
      <div className="relative z-10 w-full h-full flex items-center justify-center px-4 sm:px-8 lg:px-16">
        <div className="container mx-auto h-full flex items-center"> {/* Added flex items-center */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 xl:gap-16 w-full">
            {/* Text content */}
            <div className="w-full lg:w-7/12 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                Premium Handmade Crystal & Agate Products
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-6 sm:mb-8">
                Based in <strong>Khambhat, Gujarat</strong>, we specialize in wholesale distribution of authentic, handmade crystal products.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                <a
                  href="https://wa.me/919016507258?text=Hi, I'm interested in buying your crystal products in bulk."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-5 py-3 text-sm sm:text-base font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition-colors"
                >
                  <FaWhatsapp className="mr-2" /> Make Inquiry
                </a>

                <a
                  href="/ViewAllProduct"
                  className="inline-flex items-center justify-center px-5 py-3 text-sm sm:text-base font-medium text-white border border-gray-300 rounded-lg hover:bg-gray-100 bg-white/10 backdrop-blur-sm focus:ring-4 focus:ring-gray-100 transition-colors"
                >
                  Explore Products
                </a>
              </div>
            </div>

            {/* Image */}
            <div className="hidden lg:block lg:w-5/12">
              <img
                src="https://res.cloudinary.com/dioicxwct/image/upload/v1753539192/tehc6gmmwkqxc1jelcp1_rvhjnz.png"
                className="w-[220px] sm:w-[280px] md:w-[320px] rounded-2xl border-[3px] border-white/20 shadow-xl"
                alt="Crystal Product"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MainSlides;