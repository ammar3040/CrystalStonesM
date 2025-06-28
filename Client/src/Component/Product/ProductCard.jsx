import React from 'react';
import { FaHeart, FaShoppingCart, FaEye } from 'react-icons/fa';

function ProductCard({ productImg, productName, productAbout, ProductPrice, oldProductPrice }) {
  return (
    <div className="group max-w-xs mx-auto hover:shadow-md transition-all duration-300">
      <div className="card bg-white rounded-lg shadow-sm h-[380px] flex flex-col overflow-hidden">
        {/* Image container */}
        <figure className="relative flex-shrink-0 h-[55%] overflow-hidden">
          <img 
            src={productImg}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
            alt={productName} 
          />
          <button className="btn btn-circle btn-sm absolute top-2 right-2 bg-white/90 hover:bg-gray-100 border-none shadow-sm">
            <FaHeart className="text-gray-700 text-sm hover:text-red-500" />
          </button>
        </figure>
        
        {/* Content container */}
        <div className="card-body p-4 bg-[#fff8a8] h-[45%] flex flex-col">
          {/* Title and description */}
          <div className="flex-1">
            <h2 className="card-title text-md font-semibold text-gray-900 justify-center mb-1 line-clamp-1">
              {productName}
            </h2>
            <p className="text-gray-700 text-xs line-clamp-2 mb-2">
              {productAbout}
            </p>
          </div>
          
          {/* Price and buttons */}
          <div className="mt-auto">
            <div className="flex justify-center items-center gap-2 mb-3">
              <span className="text-gray-500 text-xs line-through">₹{oldProductPrice}</span>
              <span className="text-md font-bold text-gray-900">₹{ProductPrice}</span>
            </div>
            
            <div className="flex justify-between gap-2">
                <button className="px-4 py-1 rounded-full font-medium text-black addCartbtn transition flex items-center">
                             <FaEye className="mr-1" /> View
                           </button>
                           
                           {/* Add to Cart button */}
                           <button className="text-black px-4 py-1 rounded-full font-medium addCartbtn transition flex items-center">
                             <FaShoppingCart className="mr-1" /> Cart
                           </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;