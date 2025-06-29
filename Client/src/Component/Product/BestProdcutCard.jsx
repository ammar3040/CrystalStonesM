import React from 'react';
import { FaHeart, FaShoppingCart, FaEye } from 'react-icons/fa';
import "./Product.css";

function BestProductCard({ productImg, productName, productAbout, ProductPrice, oldProductPrice }) {
  return (
    <div className="group"> {/* Outer container for hover effects */}
      <div className="max-w-xs mx-auto overflow-hidden bg-white rounded-full shadow-lg flex flex-col transition-transform duration-300 group-hover:scale-105" style={{ height: '500px' }}>
        {/* Image container with fixed height */}
        <div className="flex-shrink-0 relative" style={{ height: '60%' }}>
          <img 
            src={productImg}
            className="w-full h-full object-cover" 
            alt="Product" 
          />
          {/* Wishlist button (bottom right of image) */}
          <button className="absolute bottom-2 right-2 bg-black p-2 rounded-full hover:bg-gray-800 transition">
            <FaHeart className="text-white" />
          </button>
        </div>
        
        {/* Content container with fixed height */}
        <div 
          className="px-6 py-4 text-white text-center flex-grow flex flex-col " 
          style={{
            backgroundColor: "#fff8a8", 
            height: '40%'
          }}
        >
          <div className='w-full mx-0 my-0'>
            <div className="font-bold text-xl  text-black">{productName}</div>
            <p className="text-gray-800 text-sm pt-1 mb-0">
              {productAbout}
            </p>
          </div>
          <hr className='text-black' />
          
          <div>
            {/* Price moved above buttons */}
            <div className="mb-1 text-black">
              <span className="text-lg text-gray-400 line-through">₹{oldProductPrice}</span>{' '}
              <span className="text-lg text-black font-bold">₹{ProductPrice}</span>
            </div>
            
            <div className="flex justify-center space-x-4">
              {/* View button */}
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

export default BestProductCard;