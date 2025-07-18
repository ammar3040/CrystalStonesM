import React from 'react'
import BestProductCard from './BestProdcutCard'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import axios from 'axios';

function BestProduct() {
  const [bestProducts, setBestProducts] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/getbestproductlist`)
      .then((res) => {
        setBestProducts(res.data);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }, []);
  

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8" id='bestProduct'>
           <h2 
  style={{
    textAlign: 'center',
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#2d3748',
    margin: '40px 0 30px',
    paddingBottom: '15px',
    position: 'relative',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  }}
>
  Best Sellers
  <span 
    style={{
      content: '""',
      position: 'absolute',
      bottom: '0',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '80px',
      height: '4px',
      backgroundColor: 'rgba(255, 248, 168, 0.7)',
      borderRadius: '2px'
    }}
  ></span>
</h2>
      
      {/* Responsive Grid with Consistent Card Sizes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
   {bestProducts.map((product) => {
  let firstSizePrice = product.dollarPrice;
  let sizeLabel = null;

  if (product.sizes && product.sizes.length > 0) {
    firstSizePrice = product.sizes[0].price;
    sizeLabel = product.sizes[0];
  }

  return (
    <div key={product._id} className="w-full">
      <BestProductCard
        pid={product._id}
        product={product}
        productImg={product.mainImage.url}
        productName={product.productName}
        productAbout={product.description}
        ProductPrice={firstSizePrice}
        oldProductPrice={product.originalPrice}
        productQuentity={product.quantity}
        productMinQuentity={product.MinQuantity}
        ModelNumber={product.modelNumber}
        size={sizeLabel}
      />
    </div>
  );
})}

      </div>
    </div>
  )
}

export default BestProduct