import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../Product/ProductCard';
import Cookies from "js-cookie";
import toast from 'react-hot-toast';
const ViewProduct = () => {
  const { ProductId } = useParams();
  const [activeThumb, setActiveThumb] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [product, setProduct] = useState(null);
  const [allProduct, setAllProduct] = useState(null);
  const navigate = useNavigate();
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
      setQuantity(parseInt(res.data.MinQuantity)); // <-- set default quantity
    })
    .catch((err) => console.error("Error fetching product:", err));
}, [ProductId]);

  if (!product) return <p>Loading...</p>;
     
let  MinQuantity= product.MinQuantity

  // Combine main image with additional images for the gallery
  const allImages = [
    product.mainImage.url,
    ...product.additionalImages.map(img => img.url)
  ];

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
  if (quantity > product.MinQuantity) {
    setQuantity(prev => prev - 1);
  }
};


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
      pid: product._id,
      quantity: quantity,
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
    <div className="container mx-auto px-4 py-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
         
          <div>
            <Swiper
              loop={true}
              spaceBetween={10}
              navigation={true}
              modules={[Navigation, Thumbs]}
              grabCursor={true}
              thumbs={{ swiper: activeThumb }}
              className="h-96 w-full rounded-lg mb-4"
            >
              {allImages.map((img, index) => (
                <SwiperSlide key={index}>
                  <img 
                    src={img} 
                    alt={`Product ${index + 1}`} 
                    className="w-full h-full object-cover"
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
                    className="w-full h-full object-cover cursor-pointer"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          
          {/* Product Info */}
          <div className="px-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.productName}</h1>
            
            {/* Category */}
            <div className="text-gray-600 mb-4 capitalize">{product.category}</div>
            
            {/* Price */}
            <div className="mb-6">
              
              {product.originalPrice && (
                <span className="text-lg text-gray-500 line-through ml-2">₹{product.originalPrice}</span>
              )}
              
              <span className="text-2xl font-bold text-gray-900">₹{product.discountedPrice}</span>
              <span className='  ms-2 font-medium'>{product.quantityUnit }</span>
               <div className="">
    <span className="text-2xl font-bold text-gray-900">USD: </span><span className="text-2xl font-semibold text-gray-800 ">${product.dollarPrice}</span>  <span className='   font-medium'>{product.quantityUnit }</span>
  </div>
              
              {product.originalPrice && (
                <span className="text-green-600 ml-2 font-medium ">
                  ({Math.round((1 - product.discountedPrice/product.originalPrice)*100)}% OFF)
                </span>
              )}
              <p className="text-sm text-gray-700 mt-2">
  Minimum Quantity: {product.MinQuantity}
</p>

            </div>
            
            {/* Highlights */}
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Highlights</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li className="text-gray-700">Crystal Type: {product.crystalType}</li>
                {product.benefits.map((benefit, index) => (
                  <li key={index} className="text-gray-700 capitalize">{benefit}</li>
                ))}
              </ul>
            </div>
            
            {/* Quantity and Add to Cart */}
            <div className="flex items-center mb-8">
              <div className="flex items-center border border-gray-300 rounded-md mr-4">
                <button 
                  onClick={decreaseQuantity}
                  className="px-3 py-1 text-lg font-medium text-gray-600 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-1 text-center w-12">{quantity}</span>
                <button 
                  onClick={increaseQuantity}
                  className="px-3 py-1 text-lg font-medium text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors duration-200 flex-1"
              >
                Add to Cart
              </button>
            </div>
            
            {/* Additional Info */}
            <div className="text-sm text-gray-500 space-y-2">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                </svg>
                Free shipping on orders over ₹500
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                30-day return policy
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Tabs */}
        <div className="mt-12 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('description')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'description' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('benefits')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'benefits' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Benefits
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Product Details
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="py-8">
          {activeTab === 'description' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Product Description</h3>
              <p className="text-gray-700">{product.description}</p>
            </div>
          )}
          
          {activeTab === 'benefits' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Healing Benefits</h3>
              <ul className="list-disc pl-5 space-y-2">
                {product.benefits.map((benefit, index) => (
                  <li key={index} className="text-gray-700 capitalize">{benefit}</li>
                ))}
              </ul>
            </div>
          )}
          
          {activeTab === 'details' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Product Details</h3>
              
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-2">Specifications</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <li className="flex">
                    <span className="text-gray-600 w-32">Dimensions:</span>
                    <span className="text-gray-800">
                      {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} mm
                    </span>
                  </li>
                  <li className="flex">
                    <span className="text-gray-600 w-32">Crystal Type:</span>
                    <span className="text-gray-800">{product.crystalType}</span>
                  </li>
                  <li className="flex">
                    <span className="text-gray-600 w-32">Quantity Unit:</span>
                    <span className="text-gray-800 capitalize">
                      {product.quantityUnit.replace('_', ' ')}
                    </span>
                  </li>
                  {product.specialNotes && (
                    <li className="flex">
                      <span className="text-gray-600 w-32">Special Notes:</span>
                      <span className="text-gray-800">{product.specialNotes}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    {/* Recommended Products */}
<div className="mt-12">
  <h2 className="text-xl font-semibold text-gray-900 mb-4">You may also like</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
    {allProduct
      ?.filter(p => p._id !== product._id) // exclude current product
      .sort(() => 0.5 - Math.random())     // shuffle
      .slice(0, 4)                          // take 4
      .map(p => (
        <ProductCard
              productImg={p?.mainImage?.url || '/fallback.png'} // Prevent crash
              productName={p?.productName || 'No Name'}
              productAbout={p?.description || 'No description available'}
              ProductPrice={p?.discountedPrice || 0}
              oldProductPrice={p?.originalPrice || 0}
              minQuentity={p?.MinQuantity || 1}
              pid={product?._id}
            />
      ))}
  </div>
</div>

    </>
  );
};

export default ViewProduct;