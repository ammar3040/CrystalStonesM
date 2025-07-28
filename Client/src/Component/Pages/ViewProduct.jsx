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
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/all`);
        const data = await response.json();
        setAllProduct(data);
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
        // Set default selected size if product has sizes
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
  }, 20000); // 20 seconds

  return () => clearTimeout(timeout);
}, [product, navigate]);

   // Update displayed price when size changes
  const displayedPrice = selectedSize 
    ? selectedSize.price 
    : product?.dollarPrice;

  const handleSizeSelection = (size) => {
    setSelectedSize(size);
  };
  if (!product) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
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

  // Recommended products
  const recommendedProducts = allProduct
    ?.filter(p => p._id !== product._id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  return (
    <>
      <ProductRichSnippet/>
     <Helmet>
        <title>Product | Crystal Stone Smart</title>
        <link rel="canonical" href={`https://crystalstonesmart.com/Product/${ProductId}`} />
      </Helmet>
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 font-sans">
        {/* Main Product Section */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Product Details */}
          <div className="lg:w-2/3 bg-white rounded-xl shadow-sm p-6">
            {/* Product Images */}
            <div className="mb-8">
              <Swiper
                loop={true}
                spaceBetween={10}
                navigation={true}
                modules={[Navigation, Thumbs]}
                grabCursor={true}
                thumbs={{ swiper: activeThumb }}
                className="h-96 w-full rounded-lg mb-4 border border-gray-200"
              >
                {allImages.map((img, index) => (
                  <SwiperSlide key={index}>
                    <img 
                      src={img} 
                      alt={`Product ${index + 1}`} 
                      className="w-full h-full object-contain"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              
              <Swiper
                onSwiper={setActiveThumb}
                loop={true}
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[Navigation, Thumbs]}
                className="h-24 w-full"
              >
                {allImages.map((img, index) => (
                  <SwiperSlide key={index}>
                    <img 
                      src={img} 
                      alt={`Thumbnail ${index + 1}`} 
                      className="w-full h-full object-cover cursor-pointer border border-gray-200 rounded"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{product.productName}</h1>
              <div className="text-lg text-gray-600 mb-6 capitalize">{product.category}</div>
              
              {/* Price Section */}
           {/* Price Section - Modified to show size price */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          {isLoggedIn ? (
            <>
              {/* Size Selection (if product has sizes) */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select Size:</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size, index) => (
                      <button
                        key={index}
                        onClick={() => handleSizeSelection(size)}
                        className={`px-4 py-2 border rounded-lg transition-colors ${
                          selectedSize?.size === size.size
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
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
                  <span className="text-3xl text-gray-500 line-through">${product.originalPrice}</span>
                )}
                <span className="text-3xl font-bold text-gray-900">${displayedPrice?displayedPrice:product.dollarPrice}</span>
                {product.quantityUnit && !product.sizes?.length && (
                  <span className="text-gray-600">{product.quantityUnit}</span>
                )}
                {product.originalPrice && (
                  <span className="text-green-600 font-semibold text-lg">
                    ({Math.round((1 - displayedPrice/product.originalPrice)*100)}% OFF)
                  </span>
                )}
              </div>
              <p className="text-gray-700 mt-2">
                <span className="font-medium">Minimum Quantity:</span> {product.MinQuantity} 
              </p>
            </>
          ) : (
            <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
              <p className="text-yellow-800 text-lg">
                To see prices, please{' '}
                <button 
                  onClick={() => navigate('/SignInPage')} 
                  className="text-blue-600 hover:underline font-semibold"
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
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button 
                      onClick={decreaseQuantity}
                      className="px-4 py-2 text-xl font-medium text-gray-600 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-6 py-2 text-center w-16 text-lg">{quantity}</span>
                    <button 
                      onClick={increaseQuantity}
                      className="px-4 py-2 text-xl font-medium text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-lg font-medium flex-1"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={handleInquiry}
                    className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 text-lg font-medium flex items-center justify-center gap-2 flex-1"
                  >
                    <FaWhatsapp className="text-xl" />
                    Inquiry
                  </button>
                </div>
              )}

              {/* Product Description */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-black mb-4">Description</h2>
                <p className="text-black font-medium leading-relaxed">{product.description}</p>
              </div>

              {/* Product Details */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-black mb-4">Product Details</h2>
                <div className="space-y-4">
                  <div className="flex">
                    <span className="text-black font-semibold w-40">Dimensions:</span>
                    <span className="text-black font-medium">
                      {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} mm
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-black font-semibold w-40">Crystal Type:</span>
                    <span className="text-black font-medium">{product.crystalType}</span>
                  </div>
                
                  <div className="flex">
                    <span className="text-black font-semibold w-40">Quantity Unit:</span>
                    <span className="text-black font-medium capitalize">
                      {product.quantityUnit.replace('_', ' ')}
                    </span>
                  </div>
                  {product.specialNotes && (
                    <div className="flex">
                      <span className="text-black font-semibold w-40">Special Notes:</span>
                      <span className="text-black font-medium">{product.specialNotes}</span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-black mb-4">Specifications:</h2>
                  {product.specifications && product.specifications.length > 0 && (
                    <div className="flex flex-col gap-2">
              
                      <div className="grid gap-2">
                        {product.specifications.map((spec, idx) => (
                          <div key={idx} className="flex gap-2">
                            <span className="font-bold text-black">{spec.key}:</span>
                            <span className="text-black font-medium">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Right Column - Recommended Products (Desktop) */}
          {recommendedProducts && recommendedProducts.length > 0 && (
            <div className="lg:w-1/3 lg:block hidden">
              <div className="sticky top-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
                <div className="space-y-6">
                  {recommendedProducts.map(product => (
                    <div 
                      key={product._id}
                      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
                      onClick={() => navigate(`/product/${product._id}`)}
                    >
                      <div className="flex">
                        <div className="w-1/3 h-[100px] flex items-center justify-center">
                          <img 
                            src={product.mainImage.url} 
                            alt={product.productName}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div className="w-2/3 p-4">
                          <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">{product.productName}</h3>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                          {isLoggedIn ? (
                            <div>
                              <span className="text-xl font-bold text-gray-900">${product.dollarPrice}</span>
                              {product.originalPrice && (
                                <span className="text-gray-500 line-through ml-2">${product.originalPrice}</span>
                              )}
                            </div>
                          ) : (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate('/SignInPage');
                              }}
                              className="text-blue-600 hover:underline text-sm font-medium"
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {recommendedProducts.map(product => (
                <div 
                  key={product._id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  <div className="w-full h-48 flex items-center justify-center bg-white">
                    <img 
                      src={product.mainImage.url} 
                      alt={product.productName}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">{product.productName}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                    {isLoggedIn ? (
                      <div>
                        <span className="text-xl font-bold text-gray-900">${product.dollarPrice}</span>
                        {product.originalPrice && (
                          <span className="text-gray-500 line-through ml-2">${product.originalPrice}</span>
                        )}
                      </div>
                    ) : (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/SignInPage');
                        }}
                        className="text-blue-600 hover:underline text-sm font-medium"
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