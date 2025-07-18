import React from 'react';
import { FaShoppingCart, FaEye, FaWhatsapp } from 'react-icons/fa';
import "./Product.css";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from "js-cookie";
import toast from 'react-hot-toast';

function BestProductCard({
  productImg,
  productName,
  productAbout,
  ProductPrice,
  oldProductPrice,
  pid,
  productMinQuentity,
  ModelNumber,
  size
}) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const finalPrice = size? size.price : ProductPrice;
  const finalSize = size ? size.size : null;

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
        quantity: productMinQuentity,
        uid: uid,
        selectedSize: finalSize,        // ✅ Send selected size
        price: finalPrice       // ✅ Send correct price for size
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
    <div className="group prdcard w-full max-w-[280px] mx-auto transition-transform duration-300 bg-transparent shadow-none sm:scale-100 scale-[0.95]">
      <div className="bg-white rounded-full overflow-hidden h-full flex flex-col hover:shadow-md" style={{border:"5px solid rgb(193,172,98)"}}>
        
        {/* Image */}
        <div className="relative h-[220px] overflow-hidden">
          <Link to={`/Product/${pid}`}>
            <img 
              src={productImg}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
              alt={productName} 
            />
          </Link>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/919016507258?text=${encodeURIComponent(
              `Hi, I'm interested in this product:\n\n📌 Name: ${productName}\n🆔 Model: ${ModelNumber}\n🖼️ Image: ${productImg}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-2 right-2 bg-green-500 text-white p-2 rounded-full shadow-md hover:bg-green-600"
          >
            <FaWhatsapp className="text-lg" />
          </a>
        </div>

        {/* Content */}
        <div className="bg-[#fff8a8] flex-grow p-4 flex flex-col">
          <Link to={`/Product/${pid}`}>
            <div className="text-center mb-2 flex-1">
              <h2 className="card-title text-[9px] text-gray-900 justify-center mb-1 line-clamp-1 tracking-tighter leading-none">
                {productName}
              </h2>
              <p className="text-gray-700 text-xs line-clamp-2 mt-1">
                {productAbout}
              </p>
            </div>
          </Link>

          {/* Price */}
          {isLoggedIn ? (
            <>
              <Link to={`/Product/${pid}`}>
                <div className="flex justify-center items-center gap-2 mb-3">
                  {oldProductPrice && (
                    <span className="text-gray-500 text-xs line-through">${oldProductPrice}</span>
                  )}
                  <span className="text-sm md:text-base font-bold text-gray-900">
                    ${finalPrice}
                  </span>
                
                  {finalSize && (
                    <span className="text-[10px] ml-2 text-gray-600">({finalSize})</span>
                  )}
                </div>
                <div>
                  <p>
                    <span className="text-gray-500 text-xs">Min Quantity: <b>{productMinQuentity}</b></span>
                  </p>
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

          {/* Buttons */}
          <div className="flex justify-center gap-0">     
            <Link to={`/Product/${pid}`}> 
              <button className="px-2 ms-2 py-1 text-xs rounded-full font-medium addCartbtn transition flex items-center">
                <FaEye className="mr-1" /> View
              </button>
            </Link>
            <button 
              className="px-2 py-1 text-xs rounded-full font-medium me-2 addCartbtn transition flex items-center" 
              onClick={handleAddToCart}
            >
              <FaShoppingCart className="mr-1" /> Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BestProductCard;
