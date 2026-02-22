import React, { useState, useEffect } from 'react';
import { ShoppingCart, Eye, MessageCircle, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from "js-cookie";
import toast from 'react-hot-toast';
import ProtectedImage from '../../ProtectedImage';

// ── Skeleton Loader (BestProduct — Light Border Style) ──
export const BestProductCardSkeleton = () => (
  <div className="w-full max-w-[280px] mx-auto relative group">
    <div
      className="bg-white border border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.06)] relative overflow-hidden"
      style={{ clipPath: 'polygon(50% 0, 100% 10%, 100% 90%, 50% 100%, 0 90%, 0 10%)' }}
    >
      {/* Shimmer overlay */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 -translate-x-full"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.02), rgba(255,255,255,0.6), rgba(0,0,0,0.02), transparent)',
            animation: 'skeleton-shimmer 1.6s infinite',
          }}
        />
      </div>

      <div className="h-[200px] bg-gradient-to-br from-gray-50 to-gray-100" />
      <div className="p-4 space-y-3 bg-white text-center">
        <div className="h-4 bg-gray-100 border border-gray-200 rounded w-3/4 mx-auto" />
        <div className="h-3 bg-gray-50 border border-gray-200 rounded w-full" />
        <div className="h-5 bg-gray-100 border border-gray-200 rounded w-20 mx-auto mt-4" />
        <div className="flex justify-center gap-2 pt-2">
          <div className="h-8 bg-gray-50 border border-gray-200 rounded-full w-16" />
          <div className="h-8 bg-gray-50 border border-gray-200 rounded-full w-16" />
        </div>
      </div>
    </div>
    <style>{`
      @keyframes skeleton-shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
    `}</style>
  </div>
);

function BestProductCard({
  productImg,
  productName,
  productAbout,
  ProductPrice,
  pid,
  productMinQuentity,
  ModelNumber,
  size,
  category,
  index = 0
}) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const finalPrice = size ? size.price : ProductPrice;
  const finalSize = size ? size.size : null;

  useEffect(() => {
    const user = Cookies.get("user");
    setIsLoggedIn(!!user);
  }, []);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const user = Cookies.get("user");
    if (!user) {
      navigate("/SignInPage");
      return;
    }

    const uid = JSON.parse(user).uid;

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/getCartItem`, {
        pid,
        quantity: productMinQuentity,
        uid,
        selectedSize: finalSize,
        price: finalPrice
      }, { withCredentials: true });

      if (res.status === 200) {
        toast.success('Added to cart!');
      }
    } catch (err) {
      console.error('Add to cart error:', err);
      toast.error('Failed to add product');
    }
  };

  const whatsappUrl = `https://wa.me/919016507258?text=${encodeURIComponent(
    `Hi, I'm interested in this Best Seller product:\n\n📌 Name: ${productName}\n🆔 Model: ${ModelNumber}\n🖼️ Image: ${productImg}`
  )}`;

  // Pillar Point Shape
  const pillarShape = 'polygon(50% 0, 100% 10%, 100% 90%, 50% 100%, 0 90%, 0 10%)';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group w-full max-w-[220px] sm:max-w-[260px] mx-auto"
    >
      {/* Featured Gradient Wrapper */}
      <div
        className="p-[3px] bg-gradient-to-b from-amber-500 via-amber-200 to-amber-500 group-hover:from-amber-600 group-hover:via-amber-300 group-hover:to-amber-600 transition-all duration-700 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/30"
        style={{ clipPath: pillarShape }}
      >
        <div
          className="bg-white overflow-hidden h-full flex flex-col relative"
          style={{ clipPath: pillarShape }}
        >
          {/* Best Seller Badge */}
          <div className="absolute top-6 left-0 right-0 z-10 flex justify-center pointer-events-none">
            <div className="bg-black text-amber-400 text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 shadow-lg border border-amber-500/30 flex items-center gap-1">
              <Star size={8} fill="currentColor" /> Best Seller
            </div>
          </div>

          {/* Image */}
          <div className="relative h-[180px] sm:h-[200px] overflow-hidden bg-gradient-to-br from-amber-50/20 to-zinc-50">
            <Link to={`/Product/${pid}`} className="block h-full">
              {!imgLoaded && (
                <div className="absolute inset-0 bg-white animate-pulse" />
              )}
              <ProtectedImage
                src={productImg}
                alt={productName}
                className={`w-full h-full object-contain p-3 sm:p-5 transition-transform duration-1000 group-hover:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                loading={index < 4 ? "eager" : "lazy"}
              />
              <img src={productImg} alt="" className="hidden" onLoad={() => setImgLoaded(true)} />
            </Link>

            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-6 right-6 bg-emerald-500 text-white p-2 sm:p-2.5 rounded shadow-xl hover:bg-emerald-600 transition-all translate-y-20 group-hover:translate-y-0 duration-500"
            >
              <MessageCircle size={14} />
            </a>
          </div>

          {/* Faceted Divider */}
          <div className="h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-50" />

          {/* Content */}
          <div className="bg-white flex-grow p-4 pt-4 flex flex-col items-center text-center">
            <Link to={`/Product/${pid}`} className="block flex-grow">
              {category && (
                <p className="text-[8px] sm:text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mb-0.5 sm:mb-1">
                  {category}
                </p>
              )}
              <h2 className="text-[11px] sm:text-xs font-black text-gray-900 mb-0.5 uppercase tracking-tight group-hover:text-amber-700 transition-colors line-clamp-2" title={productName}>
                {productName}
              </h2>
              <p className="text-[9px] sm:text-[10px] text-gray-500 line-clamp-2 leading-relaxed italic">
                {productAbout}
              </p>
            </Link>

            {/* Price Area */}
            <div className="w-full mt-3 pt-3 border-t border-amber-50 flex flex-col items-center">
              {isLoggedIn ? (
                <>
                  <Link to={`/Product/${pid}`} className="block">
                    <div className="flex items-center gap-2 mb-0.5 justify-center">
                      <span className="text-base font-black text-gray-900 tracking-tighter">
                        ${finalPrice}
                      </span>
                      <span className="text-[8px] font-bold text-amber-600 uppercase">USD</span>
                    </div>
                    <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-3">
                      Min Quantity: <span className="text-zinc-600">{productMinQuentity}</span>
                    </p>
                  </Link>

                  <div className="flex justify-center gap-2 w-full max-w-[160px]">
                    <Link to={`/Product/${pid}`} className="flex-1">
                      <button className="w-full py-1 px-2 text-[10px] font-bold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded transition-colors flex items-center justify-center gap-1">
                        <Eye size={12} /> View
                      </button>
                    </Link>
                    <button
                      className="flex-1 py-1 px-2 text-[10px] font-bold text-white bg-black hover:bg-zinc-800 rounded transition-colors flex items-center justify-center gap-1 shadow-sm"
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart size={12} /> Cart
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => navigate('/SignInPage')}
                  className="w-full py-1.5 sm:py-2 text-[9px] sm:text-[10px] font-black text-amber-900 bg-amber-50 hover:bg-amber-100 rounded border border-amber-200/50 uppercase tracking-wider"
                >
                  Sign in to shop
                </button>
              )}
            </div>
          </div>

          {/* Bottom Glow */}
          <div className="h-4 w-full bg-gradient-to-t from-amber-50/50 to-transparent" />
        </div>
      </div>
    </motion.div>
  );
}

export default BestProductCard;
