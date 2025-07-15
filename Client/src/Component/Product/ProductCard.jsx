import axios from 'axios';
import React from 'react';
import { FaShoppingCart, FaEye, FaWhatsapp } from 'react-icons/fa';
import Cookies from "js-cookie";
import toast from 'react-hot-toast';
import { Link, useNavigate } from "react-router-dom";

function ProductCard({ productImg, productName, productAbout, ProductPrice, oldProductPrice, minQuentity, pid, ModelNumber }) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    const user = Cookies.get("user");
    setIsLoggedIn(!!user);
  }, []);

  const handleAddToCart = async () => {
    const user = Cookies.get("user");
    if (!user) {
      navigate("/SignInPage");
      return;
    }

    const uid = JSON.parse(user).uid;
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/getCartItem`, {
        pid: pid,
        quantity: minQuentity,
        uid: uid
      }, { withCredentials: true });

      if (res.status === 200) {
        toast.success('🛒 Product added to cart!');
      }
    } catch (err) {
      console.error('Add to cart error:', err);
      toast.error('🛒 Failed to add product');
    }
  };

  return (
    <div className="group prdcard w-full max-w-[280px] mx-auto hover:shadow-md transition-all duration-300">
      <div className="card bg-white rounded-lg shadow-sm h-full flex flex-col overflow-hidden">
        {/* Image container with WhatsApp button */}
        <Link to={`/Product/${pid}`} className="block">
          <figure className="relative aspect-square overflow-hidden"> {/* Changed to aspect-square for better image display */}
            <img 
              src={productImg}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 p-2" /* Changed to object-contain and added padding */
              alt={productName} 
            />
            {/* WhatsApp inquiry button */}
            <a
              href={`https://wa.me/919016507258?text=${encodeURIComponent(
                `Hi, I'm interested in this product:\n\n📌 Name: ${productName}\n🆔 Model: ${ModelNumber}\n🖼️ Image: ${productImg}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-2 right-2 bg-green-500 text-white p-2 rounded-full shadow-md hover:bg-green-600 transition-colors duration-200"
              aria-label="Inquire via WhatsApp"
              onClick={(e) => e.stopPropagation()}
            >
              <FaWhatsapp className="text-lg" />
            </a>
          </figure>
        </Link>
        
        {/* Content container */}
        <div className="card-body p-3 sm:p-4 bg-[#fff8a8] flex-grow flex flex-col">
          {/* Title and description */}
          <Link to={`/Product/${pid}`} className="block">
            <div className="flex-1">
              <h2 className="card-title text-[11px] sm:text-xs font-semibold text-gray-900 justify-center mb-1 line-clamp-1 tracking-tighter leading-tight">
                {productName}
              </h2>
              <p className="text-gray-700 text-xs line-clamp-2 mb-2">
                {productAbout}
              </p>
            </div>
          </Link>
          
          {/* Price and buttons */}
          <div className="mt-auto">
            {isLoggedIn ? (
              <>
                <Link to={`/Product/${pid}`} className="block">
                  <div className="flex justify-center items-center gap-2 mb-2 sm:mb-3">
                    {oldProductPrice && (
                      <span className="text-gray-500 text-xs line-through">${oldProductPrice}</span>
                    )}
                    <span className="text-sm sm:text-md font-bold text-gray-900">${ProductPrice}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-gray-500 text-xs">Min Qty: <b>{minQuentity}</b></span>
                  </div>
                </Link>
              </>
            ) : (
              <div className="mb-3 text-center">
                <button 
                  onClick={() => navigate('/SignInPage')}
                  className="text-blue-600 hover:underline text-xs font-medium"
                >
                  Login to see price
                </button>
              </div>
            )}
            
            <div className="flex justify-between gap-2">
              <Link to={`/Product/${pid}`} className="block">
                <button className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full font-medium text-black addCartbtn transition flex items-center">
                  <FaEye className="mr-1" /> View
                </button>
              </Link>
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
  );
}

export default ProductCard;