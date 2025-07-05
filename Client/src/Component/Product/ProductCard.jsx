import axios from 'axios';
import React from 'react';
import { FaHeart, FaShoppingCart, FaEye } from 'react-icons/fa';
import Cookies from "js-cookie";
import toast from 'react-hot-toast';

import { useNavigate } from "react-router-dom";

function ProductCard({ productImg, productName, productAbout, ProductPrice, oldProductPrice, minQuentity, pid }) {
const navigate = useNavigate();
const handleAddToCart = async () => {
  const user = Cookies.get("user");

  if (!user) {
    // Not logged in, redirect
    navigate("/SignInPage");
    return;
  }

  const uid = JSON.parse(user).uid;

  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/getCartItem`, {
      pid: pid,
      quantity: minQuentity,
      uid: uid
    }, {
      withCredentials: true
    });

    if (res.status === 200) {
      toast.success('🛒 Product added to cart!');

    }
  } catch (err) {
    console.error('Add to cart error:', err);
    toast.success('🛒 fail to add product');

  }
};


  return (
    <>
    <div className="group prdcard w-full max-w-[280px] mx-auto hover:shadow-md transition-all duration-300">
      <div className="card bg-white rounded-lg shadow-sm h-full flex flex-col overflow-hidden">
        {/* Image container */}
        <figure className="relative aspect-[4/3] overflow-hidden">
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
        <div className="card-body p-3 sm:p-4 bg-[#fff8a8] flex-grow flex flex-col">
          {/* Title and description */}
          <div className="flex-1">
            <h2 className="card-title text-sm sm:text-md font-semibold text-gray-900 justify-center mb-1 line-clamp-1">
              {productName}
            </h2>
            <p className="text-gray-700 text-xs line-clamp-2 mb-2">
              {productAbout}
            </p>
          </div>
          
          {/* Price and buttons */}
          <div className="mt-auto">
            <div className="flex justify-center items-center gap-2 mb-2 sm:mb-3">
              <span className="text-gray-500 text-xs line-through">₹{oldProductPrice}</span>
              <span className="text-sm sm:text-md font-bold text-gray-900">₹{ProductPrice}</span>
            </div>
            
            <div className="flex justify-between gap-2">
              <button className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full font-medium text-black addCartbtn transition flex items-center">
                <FaEye className="mr-1" /> View
              </button>
              
              <button 
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full font-medium text-black addCartbtn transition flex items-center" 
                onClick={handleAddToCart}

              >
                <FaShoppingCart className="mr-1" /> Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default ProductCard;