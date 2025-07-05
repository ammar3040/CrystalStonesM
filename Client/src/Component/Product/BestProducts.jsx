import React from 'react'
import ProductCard from './BestProdcutCard'
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
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <h2 className="text-2xl font-bold text-center mb-6 sm:mb-8">Our Best Selling Agates</h2>
      
      {/* Responsive Grid with Consistent Card Sizes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
        {bestProducts.map((product) => (
          <div key={product._id} className="w-full">
            <Link to={`/Product/${product._id}`} className="block h-full">
              <ProductCard
                product={product}
                productImg={product.mainImage.url}
                productName={product.productName}
                productAbout={product.description}
                ProductPrice={product.discountedPrice}
                oldProductPrice={product.originalPrice}
                productQuentity={product.quantity}
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BestProduct