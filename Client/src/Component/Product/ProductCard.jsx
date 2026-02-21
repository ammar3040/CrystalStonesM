import React, { useState, useEffect } from 'react';
import { Eye, ShoppingCart, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Cookies from "js-cookie";
import toast from 'react-hot-toast';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import ProtectedImage from '../../ProtectedImage';

// ── Skeleton Loader (Crystal-shaped with shimmer) ──
export const ProductCardSkeleton = () => (
  <div className="w-full max-w-[300px] mx-auto">
    <div
      className="bg-white overflow-hidden border border-zinc-400 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.3)] relative"
      style={{ clipPath: 'polygon(8% 0, 92% 0, 100% 5%, 100% 95%, 92% 100%, 8% 100%, 0 95%, 0 5%)' }}
    >
      {/* Shimmer overlay */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 -translate-x-full"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.1), rgba(255,255,255,0.4), rgba(0,0,0,0.1), transparent)',
            animation: 'skeleton-shimmer 1.5s infinite',
          }}
        />
      </div>

      <div className="aspect-square bg-gradient-to-br from-amber-200/50 to-gray-400 relative shadow-inner" />
      <div className="p-4 space-y-3 bg-white">
        <div className="h-4 bg-amber-300 rounded-md w-3/4 mx-auto shadow-sm" />
        <div className="h-3 bg-gray-400/80 rounded-md w-full" />
        <div className="h-3 bg-gray-400/80 rounded-md w-1/2 mx-auto" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-5 bg-amber-300 rounded-md w-16" />
          <div className="h-8 bg-gray-400/80 rounded-md w-20" />
        </div>
      </div>

      <style>{`
        @keyframes skeleton-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  </div>
);

function ProductCard({
  productImg,
  productName,
  productAbout,
  ProductPrice,
  dollarPrice,
  minQuentity,
  pid,
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
        quantity: minQuentity,
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
    `Hi, I'm interested in this product:\n\n📌 Name: ${productName}\n🆔 Model: ${ModelNumber}\n🖼️ Image: ${productImg}`
  )}`;

  // Crystal-faceted shape
  const crystalClip = 'polygon(8% 0, 92% 0, 100% 5%, 100% 95%, 92% 100%, 8% 100%, 0 95%, 0 5%)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-[300px] mx-auto"
      whileHover={{ y: -6 }}
    >
      {/* Golden glow border wrapper */}
      <div
        className="p-[2px] bg-gradient-to-b from-amber-300 via-amber-100 to-amber-300 hover:from-amber-400 hover:via-amber-200 hover:to-amber-400 transition-all duration-500 shadow-md hover:shadow-xl hover:shadow-amber-300/40"
        style={{ clipPath: crystalClip }}
      >
        <div
          className="group bg-white overflow-hidden h-full flex flex-col"
          style={{ clipPath: crystalClip }}
        >

          {/* ── Image Section ── */}
          <Link to={`/Product/${pid}`} className="block relative">
            <div className="aspect-square overflow-hidden bg-gradient-to-br from-amber-50/30 to-white relative">
              {!imgLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-zinc-50 animate-pulse" />
              )}
              <ProtectedImage
                src={productImg}
                alt={productName}
                className={`w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              />
              <img
                src={productImg}
                alt=""
                className="hidden"
                onLoad={() => setImgLoaded(true)}
              />

              {/* Subtle golden gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-amber-100/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Quick actions — slide in from right on hover */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-14 group-hover:translate-x-0 transition-transform duration-300">
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
                  }}
                  className="w-9 h-9 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg flex items-center justify-center shadow-lg transition-colors cursor-pointer"
                  title="WhatsApp Inquiry"
                >
                  <MessageCircle size={15} />
                </div>
              </div>

              {/* Size badge */}
              {finalSize && (
                <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/70 backdrop-blur-sm text-[10px] font-bold text-amber-300 uppercase tracking-wider rounded shadow-sm">
                  {finalSize}
                </div>
              )}
            </div>
          </Link>

          {/* ── Crystal-themed golden divider ── */}
          <div className="h-[1px] bg-gradient-to-r from-transparent via-amber-300 to-transparent" />

          {/* ── Content Section ── */}
          <div className="px-4 pt-3 pb-4 flex-1 flex flex-col bg-white">
            <Link to={`/Product/${pid}`} className="block flex-1">
              {category && (
                <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mb-1 text-center">
                  {category}
                </p>
              )}
              <h3 className="text-sm font-bold text-zinc-900 line-clamp-1 mb-1 text-center group-hover:text-amber-700 transition-colors">
                {productName}
              </h3>
              <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed text-center">
                {productAbout}
              </p>
            </Link>

            {/* Price + Actions */}
            <div className="mt-3 pt-3 border-t border-amber-100/60">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-lg font-black text-zinc-900">${finalPrice || dollarPrice}</span>
                      <span className="text-[9px] text-amber-600 ml-1 font-bold uppercase">USD</span>
                    </div>
                    <span className="text-[9px] text-zinc-500 font-bold bg-amber-50 px-2 py-1 rounded uppercase tracking-wider">
                      Min {minQuentity}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Link to={`/Product/${pid}`} className="flex-1">
                      <button className="w-full py-2 px-3 text-xs font-bold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors flex items-center justify-center gap-1.5">
                        <Eye size={13} /> View
                      </button>
                    </Link>
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 py-2 px-3 text-xs font-bold text-white bg-black hover:bg-zinc-800 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <ShoppingCart size={13} /> Cart
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => navigate('/SignInPage')}
                  className="w-full py-2.5 text-xs font-bold text-amber-800 bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 rounded-lg transition-all border border-amber-200/50"
                >
                  Sign in to see prices
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ProductCard;