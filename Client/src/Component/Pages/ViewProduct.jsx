import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from "js-cookie";
import toast from 'react-hot-toast';
import { FaWhatsapp } from 'react-icons/fa';
import { Helmet } from 'react-helmet';
import ProductRichSnippet from './ProductRichSnippet';
import ReactImageMagnify from 'react-image-magnify';
import ProtectedImage from '../../ProtectedImage';

const ViewProduct = () => {
  const { ProductId } = useParams();
  const [activeThumb, setActiveThumb] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [allProduct, setAllProduct] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    const user = Cookies.get("user");
    setIsLoggedIn(!!user);
  }, []);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/all?limit=20`);
        const data = await response.json();
        setAllProduct(data.products || []);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    fetchAllProducts();
  }, []);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/product/?id=${ProductId}`)
      .then((res) => {
        setProduct(res.data);
        setQuantity(parseInt(res.data.MinQuantity));
        if (res.data.sizes && res.data.sizes.length > 0) {
          setSelectedSize(res.data.sizes[0]);
        }
      })
      .catch((err) => console.error("Error fetching product:", err));
  }, [ProductId]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!product) {
        navigate('/ViewAllProduct');
      }
    }, 20000);

    return () => clearTimeout(timeout);
  }, [product, navigate]);

  const displayedPrice = selectedSize
    ? selectedSize.price
    : product?.dollarPrice;

  const handleSizeSelection = (size) => {
    setSelectedSize(size);
  };

  if (!product) return (
    <div className="bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20 min-h-screen">
      <style>{`
        @keyframes skeleton-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .shimmer-active {
          position: relative;
          overflow: hidden;
        }
        .shimmer-active::after {
          content: "";
          position: absolute;
          inset: 0;
          transform: translateX(-100%);
          background: linear-gradient(90deg, transparent, rgba(0,0,0,0.02), rgba(255,255,255,0.4), rgba(0,0,0,0.02), transparent);
          animation: skeleton-shimmer 2s infinite;
        }
      `}</style>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2 mb-6">
          <div className="h-3 w-12 bg-gray-100 border border-gray-200 rounded animate-pulse" />
          <div className="h-3 w-3 bg-gray-100 border border-gray-200 rounded animate-pulse" />
          <div className="h-3 w-20 bg-gray-100 border border-gray-200 rounded animate-pulse" />
          <div className="h-3 w-3 bg-gray-100 border border-gray-200 rounded animate-pulse" />
          <div className="h-3 w-32 bg-gray-200 border border-gray-200 rounded animate-pulse" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column Skeleton */}
          <div className="lg:w-2/3 bg-white rounded-2xl shadow-[0_8px_30px_-10px_rgba(0,0,0,0.08)] p-6 border border-gray-200 shimmer-active">
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
              {/* Thumbnail column */}
              <div className="hidden lg:flex flex-col gap-2 w-20">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-20 w-20 rounded-xl bg-gray-50 animate-pulse border border-gray-200" />
                ))}
              </div>
              {/* Main image */}
              <div className="flex-1 h-96 rounded-xl bg-gray-50 animate-pulse border border-gray-200" />
            </div>

            {/* Category badge */}
            <div className="h-6 w-24 rounded-full bg-amber-50 border border-amber-200 animate-pulse mb-3" />
            {/* Title */}
            <div className="h-8 w-3/4 rounded bg-gray-100 border border-gray-200 animate-pulse mb-2" />
            {/* Divider */}
            <div className="w-16 h-1 bg-amber-100 border border-amber-200 rounded-full mb-6 animate-pulse" />
            {/* Price section */}
            <div className="p-5 bg-amber-50/50 rounded-2xl border border-amber-200 mb-8">
              <div className="h-8 w-28 rounded bg-gray-100 border border-gray-200 animate-pulse mb-2" />
              <div className="h-4 w-40 rounded bg-gray-50 border border-gray-200 animate-pulse" />
            </div>
            {/* Buttons */}
            <div className="flex gap-4 mb-10">
              <div className="h-12 w-32 rounded-xl bg-gray-50 border border-gray-200 animate-pulse" />
              <div className="h-12 flex-1 rounded-xl bg-amber-50 border border-amber-200 animate-pulse" />
              <div className="h-12 flex-1 rounded-xl bg-emerald-50 border border-emerald-200 animate-pulse" />
            </div>
            {/* Description */}
            <div className="space-y-4 mb-8">
              <div className="h-5 w-36 rounded bg-gray-100 border border-gray-200 animate-pulse" />
              <div className="h-3 w-full rounded bg-gray-50 border border-gray-200 animate-pulse" />
              <div className="h-3 w-5/6 rounded bg-gray-50 border border-gray-200 animate-pulse" />
              <div className="h-3 w-4/6 rounded bg-gray-50 border border-gray-200 animate-pulse" />
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="lg:w-1/3 hidden lg:block">
            <div className="h-6 w-40 rounded bg-gray-100 border border-gray-200 animate-pulse mb-6" />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-3 mb-4 flex gap-3 shadow-[0_4px_20px_rgba(0,0,0,0.04)] shimmer-active">
                <div className="w-20 h-20 rounded-xl bg-gray-50 animate-pulse flex-shrink-0 border border-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-gray-100 border border-gray-200 animate-pulse" />
                  <div className="h-3 w-full rounded bg-gray-50 border border-gray-200 animate-pulse" />
                  <div className="h-5 w-16 rounded bg-amber-50 border border-amber-200 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const allImages = [
    product.mainImage.url,
    ...product.additionalImages.map(img => img.url)
  ];

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => quantity > product.MinQuantity && setQuantity(prev => prev - 1);

  const handleAddToCart = async () => {
    const user = Cookies.get("user");
    if (!user) {
      navigate("/SignInPage");
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/getCartItem`, {
        pid: product._id,
        quantity: quantity,
        uid: JSON.parse(user).uid,
        selectedSize: selectedSize?.size || null,
        price: displayedPrice
      }, { withCredentials: true });

      if (res.status === 200) toast.success('🛒 Product added to cart!');
    } catch (err) {
      console.error('Add to cart error:', err);
      toast.error('Failed to add product to cart');
    }
  };

  const handleInquiry = () => {
    const message = `Hi, I'm interested in this product:\n\n📌 Name: ${product.productName}\n🆔 Model: ${product.modelNumber || 'N/A'}\n🖼️ Image: ${product.mainImage.url}`;
    window.open(`https://wa.me/919016507258?text=${encodeURIComponent(message)}`, '_blank');
  };

  const recommendedProducts = allProduct
    ?.filter(p => p._id !== product._id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  return (
    <>
      <ProductRichSnippet />
      <Helmet>
        <title>{product.productName} | Crystal Stones Mart | Authentic Khambhat Akik</title>
        <meta name="description" content={product.description.substring(0, 160)} />
        <link rel="canonical" href={`https://crystalstonesmart.com/Product/${ProductId}`} />
        <meta
          name="keywords"
          content={`${product.productName}, ${product.category}, Khambhat agate, handmade agate, crystal stones mart, healing stones, authentic gemstones, certified stones India`}
        />

        {/* Open Graph Tags for Product */}
        <meta property="og:title" content={`${product.productName} | Crystal Stones Mart`} />
        <meta property="og:description" content={product.description.substring(0, 160)} />
        <meta property="og:image" content={product.mainImage.url} />
        <meta property="og:type" content="product" />
        <meta property="product:price:amount" content={displayedPrice || product.dollarPrice} />
        <meta property="product:price:currency" content="USD" />
        <meta property="og:site_name" content="Crystal Stones Mart" />

        {/* Product Specific Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.productName,
            "image": [product.mainImage.url, ...product.additionalImages.map(img => img.url)],
            "description": product.description,
            "sku": product.modelNumber || ProductId,
            "mpn": product.modelNumber || ProductId,
            "brand": {
              "@type": "Brand",
              "name": "Crystal Stones Mart"
            },
            "offers": {
              "@type": "Offer",
              "url": `https://crystalstonesmart.com/Product/${ProductId}`,
              "priceCurrency": "USD",
              "price": displayedPrice || product.dollarPrice,
              "priceValidUntil": "2026-12-31",
              "itemCondition": "https://schema.org/NewCondition",
              "availability": "https://schema.org/InStock",
              "seller": {
                "@type": "Organization",
                "name": "Crystal Stones Mart"
              }
            }
          })}
        </script>
      </Helmet>

      <div className="bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20 min-h-screen">
        <div className="container mx-auto px-4 py-8 font-sans">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <a href="/" className="hover:text-amber-600 transition-colors" style={{ textDecoration: 'none', color: 'inherit' }}>Home</a>
            <span>/</span>
            <a href="/ViewAllProduct" className="hover:text-amber-600 transition-colors" style={{ textDecoration: 'none', color: 'inherit' }}>Collections</a>
            <span>/</span>
            <span className="text-amber-700 font-medium">{product.productName}</span>
          </div>

          {/* Main Product Section */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Product Details */}
            <div className="lg:w-2/3 bg-white rounded-2xl shadow-sm p-6 border border-amber-100/50">
              {/* Product Images */}
              <div className="mb-8">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Thumbnail Column (left side) */}
                  <div className="hidden lg:flex flex-col gap-2 w-20">
                    {allImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveThumb(index)}
                        className={`relative h-20 w-20 border-2 rounded-xl overflow-hidden transition-all ${activeThumb === index ? 'border-amber-500 ring-2 ring-amber-400/30 shadow-md' : 'border-gray-200 hover:border-amber-300'
                          }`}
                      >
                        <ProtectedImage
                          src={img}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-contain"
                        />
                      </button>
                    ))}
                  </div>

                  {/* Main Image with Zoom */}
                  <div className="relative w-full lg:w-[calc(100%-6rem)] h-96 bg-white rounded-xl overflow-hidden border border-amber-100/30">
                    <div className="relative w-full h-full group">
                      <Swiper
                        loop={true}
                        spaceBetween={10}
                        navigation={true}
                        modules={[Navigation, Thumbs]}
                        grabCursor={true}
                        initialSlide={activeThumb || 0}
                        onSlideChange={(swiper) => setActiveThumb(swiper.realIndex)}
                        className="h-full w-full"
                      >
                        {allImages.map((img, index) => (
                          <SwiperSlide key={index}>
                            <div className="relative w-full h-full flex items-center justify-center bg-white">
                              <ReactImageMagnify
                                {...{
                                  smallImage: {
                                    alt: "Product Image",
                                    isFluidWidth: true,
                                    src: img,
                                    sizes: '(max-width: 480px) 100vw, (max-width: 1200px) 30vw, 360px'
                                  },
                                  largeImage: {
                                    src: img,
                                    width: 1200,
                                    height: 1800
                                  },
                                  lensStyle: {
                                    backgroundColor: 'rgba(0,0,0,.1)',
                                    border: '1px solid rgba(0,0,0,.2)'
                                  },
                                  lensComponent: ({ style }) => (
                                    <div style={{
                                      ...style,
                                      backgroundColor: 'rgba(0,0,0,.1)',
                                      border: '1px solid rgba(0,0,0,.2)',
                                      borderRadius: '50%',
                                      cursor: 'crosshair'
                                    }} />
                                  ),
                                  enlargedImageContainerStyle: {
                                    zIndex: 100000,
                                    top: 0,
                                    left: "0",
                                    position: "fixed",
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                    background: 'white'
                                  },
                                  enlargedImageContainerDimensions: {
                                    width: '150%',
                                    height: '150%'
                                  },
                                  enlargedImagePosition: "beside",
                                  isHintEnabled: true,
                                  shouldUsePositiveSpaceLens: true,
                                  imageClassName: "object-contain",
                                  enlargedImageClassName: "object-contain"
                                }}
                              />
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  </div>
                </div>

                {/* Thumbnail Slider (Mobile) */}
                <div className="lg:hidden mt-4">
                  <Swiper
                    loop={true}
                    spaceBetween={10}
                    slidesPerView={4}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[Navigation, Thumbs]}
                    className="thumbnail-slider h-24"
                  >
                    {allImages.map((img, index) => (
                      <SwiperSlide key={index}>
                        <button
                          onClick={() => setActiveThumb(index)}
                          className={`relative h-full w-full border-2 rounded-xl overflow-hidden transition-all ${activeThumb === index ? 'border-amber-500 ring-2 ring-amber-400/30' : 'border-gray-200'
                            }`}
                        >
                          <ProtectedImage
                            src={img}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-contain "
                            style={{ zIndex: 1000000 }}
                          />
                        </button>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>

              {/* Product Info */}
              <div>
                {/* Category badge */}
                <div className="mb-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] bg-amber-100 text-amber-700 border border-amber-200/50">
                    {product.category}
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2 tracking-tight">{product.productName}</h1>

                {/* Amber divider */}
                <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full mb-6" />

                {/* Price Section */}
                <div className="mb-8 p-5 bg-gradient-to-br from-amber-50/80 to-amber-100/30 rounded-2xl border border-amber-200/40">
                  {isLoggedIn ? (
                    <>
                      {/* Size Selection */}
                      {product.sizes && product.sizes.length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Select Size</h3>
                          <div className="flex flex-wrap gap-2">
                            {product.sizes.map((size, index) => (
                              <button
                                key={index}
                                onClick={() => handleSizeSelection(size)}
                                className={`px-4 py-2 border-2 rounded-xl transition-all text-sm font-semibold ${selectedSize?.size === size.size
                                  ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20'
                                  : 'bg-white text-gray-700 border-amber-200 hover:border-amber-400 hover:bg-amber-50'
                                  }`}
                              >
                                {size.size}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center flex-wrap gap-3 mb-2">
                        {product.originalPrice && (
                          <span className="text-2xl text-gray-400 line-through">${product.originalPrice}</span>
                        )}
                        <span className="text-3xl font-black text-gray-900">${displayedPrice ? displayedPrice : product.dollarPrice}</span>
                        {product.quantityUnit && !product.sizes?.length && (
                          <span className="text-gray-500 text-sm font-medium">{product.quantityUnit}</span>
                        )}
                        {product.originalPrice && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-sm font-bold">
                            {Math.round((1 - displayedPrice / product.originalPrice) * 100)}% OFF
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-sm mt-2">
                        <span className="font-semibold text-gray-700">Min. Quantity:</span> {product.MinQuantity} pcs
                      </p>
                    </>
                  ) : (
                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                      <p className="text-amber-800 text-lg">
                        To see prices, please{' '}
                        <button
                          onClick={() => navigate('/SignInPage')}
                          className="text-amber-600 hover:text-amber-700 font-bold underline underline-offset-2"
                        >
                          login
                        </button>
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {isLoggedIn && (
                  <div className="mb-10 flex flex-col sm:flex-row gap-4">
                    {/* Quantity */}
                    <div className="flex items-center border-2 border-amber-200 rounded-xl overflow-hidden">
                      <button
                        onClick={decreaseQuantity}
                        className="w-12 h-12 text-xl font-bold text-amber-700 hover:bg-amber-50 transition-colors"
                      >
                        −
                      </button>
                      <span className="w-14 h-12 flex items-center justify-center text-lg font-bold text-gray-800 bg-amber-50/50">{quantity}</span>
                      <button
                        onClick={increaseQuantity}
                        className="w-12 h-12 text-xl font-bold text-amber-700 hover:bg-amber-50 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Add to Cart */}
                    <button
                      onClick={handleAddToCart}
                      className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-3 rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all text-sm font-bold flex-1 uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-[0.98]"
                    >
                      Add to Cart
                    </button>

                    {/* WhatsApp Inquiry */}
                    <button
                      onClick={handleInquiry}
                      className="bg-emerald-600 text-white px-8 py-3 rounded-xl hover:bg-emerald-700 transition-all text-sm font-bold flex items-center justify-center gap-2 flex-1 uppercase tracking-wider shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
                    >
                      <FaWhatsapp className="text-lg" />
                      Inquiry
                    </button>
                  </div>
                )}

                {/* Product Description */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-6 bg-amber-500 rounded-full" />
                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Description</h2>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>

                {/* Product Details */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-6 bg-amber-500 rounded-full" />
                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Product Details</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 p-3 bg-amber-50/50 rounded-xl border border-amber-100/50">
                      <span className="text-xs font-bold text-amber-700 uppercase tracking-wider w-28 flex-shrink-0">Dimensions</span>
                      <span className="text-sm text-gray-700">
                        {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} mm
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-amber-50/50 rounded-xl border border-amber-100/50">
                      <span className="text-xs font-bold text-amber-700 uppercase tracking-wider w-28 flex-shrink-0">Crystal Type</span>
                      <span className="text-sm text-gray-700">{product.crystalType}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-amber-50/50 rounded-xl border border-amber-100/50">
                      <span className="text-xs font-bold text-amber-700 uppercase tracking-wider w-28 flex-shrink-0">Quantity Unit</span>
                      <span className="text-sm text-gray-700 capitalize">
                        {product.quantityUnit.replace('_', ' ')}
                      </span>
                    </div>
                    {product.specialNotes && (
                      <div className="flex items-center gap-3 p-3 bg-amber-50/50 rounded-xl border border-amber-100/50">
                        <span className="text-xs font-bold text-amber-700 uppercase tracking-wider w-28 flex-shrink-0">Special Notes</span>
                        <span className="text-sm text-gray-700">{product.specialNotes}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Specifications */}
                {product.specifications && product.specifications.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-1 h-6 bg-amber-500 rounded-full" />
                      <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Specifications</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {product.specifications.map((spec, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-amber-50/50 rounded-xl border border-amber-100/50">
                          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider flex-shrink-0">{spec.key}</span>
                          <span className="text-sm text-gray-700">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Recommended Products (Desktop) */}
            {recommendedProducts && recommendedProducts.length > 0 && (
              <div className="lg:w-1/3 lg:block hidden">
                <div className="sticky top-20">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 bg-amber-500 rounded-full" />
                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">You May Also Like</h2>
                  </div>
                  <div className="space-y-4">
                    {recommendedProducts.map(product => (
                      <div
                        key={product._id}
                        className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer border border-amber-100/50 group"
                        onClick={() => navigate(`/product/${product._id}`)}
                      >
                        <div className="flex">
                          <div className="w-1/3 h-[100px] flex items-center justify-center bg-amber-50/30 p-2">
                            <img
                              src={product.mainImage.url}
                              alt={product.productName}
                              className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          </div>
                          <div className="w-2/3 p-4">
                            <h3 className="font-bold text-sm text-gray-900 mb-1 line-clamp-1 group-hover:text-amber-700 transition-colors">{product.productName}</h3>
                            <p className="text-gray-500 text-xs mb-2 line-clamp-2">{product.description}</p>
                            {isLoggedIn ? (
                              <div>
                                <span className="text-lg font-black text-amber-700">${product.dollarPrice || (product.sizes && product.sizes.length > 0 ? product.sizes[0].price : 'N/A')}</span>
                                {product.originalPrice && (
                                  <span className="text-gray-400 line-through ml-2 text-sm">${product.originalPrice}</span>
                                )}
                              </div>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate('/SignInPage');
                                }}
                                className="text-amber-600 hover:text-amber-700 text-xs font-bold"
                              >
                                Login to see price
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Recommended Products (Mobile) */}
          {recommendedProducts && recommendedProducts.length > 0 && (
            <div className="lg:hidden mt-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-amber-500 rounded-full" />
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">You May Also Like</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recommendedProducts.map(product => (
                  <div
                    key={product._id}
                    className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer border border-amber-100/50 group"
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    <div className="w-full h-48 flex items-center justify-center bg-amber-50/30 p-4">
                      <img
                        src={product.mainImage.url}
                        alt={product.productName}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-sm text-gray-900 mb-1 line-clamp-1 group-hover:text-amber-700 transition-colors">{product.productName}</h3>
                      <p className="text-gray-500 text-xs mb-3 line-clamp-2">{product.description}</p>
                      {isLoggedIn ? (
                        <div>
                          <span className="text-lg font-black text-amber-700">${product.dollarPrice || (product.sizes && product.sizes.length > 0 ? product.sizes[0].price : 'N/A')}</span>
                          {product.originalPrice && (
                            <span className="text-gray-400 line-through ml-2 text-sm">${product.originalPrice}</span>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/SignInPage');
                          }}
                          className="text-amber-600 hover:text-amber-700 text-xs font-bold"
                        >
                          Login to see price
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewProduct;
