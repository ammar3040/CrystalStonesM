import React from 'react';
import { FaHeart, FaShoppingCart, FaEye } from 'react-icons/fa';
import "./Product.css";

function BestProductCard({ productImg, productName, productAbout, ProductPrice, oldProductPrice }) {
  return (
  <div className="group prdcard w-full max-w-[280px] mx-auto transition-all duration-300 bg-transparent shadow-none">

      {/* Capsule-shaped container */}
      <div className="bg-white rounded-full overflow-hidden  h-full flex flex-col hover:shadow-md">
        {/* Image container (top half of capsule) */}
        <div className="relative h-[220px] overflow-hidden">
          <img 
            src={productImg}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
            alt={productName} 
          />
          {/* Wishlist button */}
          <button className="absolute top-3 right-3 bg-white/90 hover:bg-gray-100 p-2 rounded-full  transition">
            <FaHeart className="text-gray-700 text-sm hover:text-red-500" />
          </button>
        </div>
        
        {/* Content container (bottom half of capsule) */}
        <div className="bg-[#fff8a8] flex-grow p-4 flex flex-col">
          {/* Title and description */}
          <div className="text-center mb-2 flex-1">
            <h2 className="font-semibold text-gray-900 text-sm md:text-base line-clamp-1">
              {productName}
            </h2>
            <p className="text-gray-700 text-xs line-clamp-2 mt-1">
              {productAbout}
            </p>
          </div>
          
          {/* Price */}
          <div className="flex justify-center items-center gap-2 mb-3">
            <span className="text-gray-500 text-xs line-through">₹{oldProductPrice}</span>
            <span className="text-sm md:text-base font-bold text-gray-900">₹{ProductPrice}</span>
          </div>
          
          {/* Buttons */}
          <div className="flex justify-center gap-0">            <button className="px-2 ms-2 py-1 text-xs rounded-full font-medium addCartbtn transition flex items-center">
              <FaEye className="mr-1" /> View
            </button>
            <button className="px-2 py-1 text-xs rounded-full font-medium me-2  addCartbtn transition flex items-center">
              <FaShoppingCart className="mr-1" /> Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BestProductCard;