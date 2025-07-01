// BestProduct.jsx
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
        setBestProducts(res.data); // store product data
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }, []);


  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-center mb-8">Our Best Selling Agates</h2>
      
      {/* Responsive Grid with Fixed Card Sizes */}
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

        {bestProducts.map((product) => (
          <Link to={"/Product/"+product._id}>
          <ProductCard
            key={product._id}
            product={product}
            productImg={product.mainImage.url}
          
            productName={product.productName}
            productAbout={product.description}
            ProductPrice={product. discountedPrice}
            oldProductPrice={product.originalPrice}
          />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default BestProduct