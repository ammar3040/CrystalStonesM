// AllProducts.jsx (new component)
import React, { use, useEffect, useState } from 'react'

import { Link, useParams } from 'react-router-dom'
import ProductCard from '../Product/ProductCard'
import axios from 'axios';

function CatagoryProducts() {
  

const [products, setProducts] = useState([]);
const catagoryName=useParams().CatagoryName; 

  useEffect(() => {


    axios.get(`${import.meta.env.VITE_API_URL}/api/catagoryproduct/?catagoryName=${catagoryName}`)
      .then((res) => {
        setProducts(res.data); // store product data
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }, []);
  console.log(products);
  

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-center mb-8">Explore Our Agate Collection</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {products.map((product) => (
          <Link to={`/Product/${product._id}`} key={product._id}>
            <ProductCard
              productImg={product.mainImage.url}
              productName={product.productName}
              productAbout={product.description}
              ProductPrice={product.discountedPrice}
              oldProductPrice={product.originalPrice}
            />
          </Link>
        ))}
      </div>
  
      {/* Optional View More Button */}
      <div className="text-center mt-8">
        <button className="px-6 py-2 border border-amber-500 text-amber-500 rounded-md hover:bg-amber-500 hover:text-white transition-colors">
          View All Products
        </button>
      </div>
    </div>
  )
}

export default CatagoryProducts