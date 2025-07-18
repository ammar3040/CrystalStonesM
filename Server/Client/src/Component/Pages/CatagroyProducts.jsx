import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../Product/ProductCard';
import axios from 'axios';

function CatagoryProducts() {
  const { CatagoryName } = useParams();
  const catagoryName = decodeURIComponent(CatagoryName); // ✅ Decode URL param

  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/catagoryproduct/?catagoryName=${catagoryName}`)
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }, [catagoryName]); // ✅ Add dependency

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-center mb-8">Explore Our Collection</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            productImg={product.mainImage.url}
            productName={product.productName}
            productAbout={product.description}
            ProductPrice={product.dollarPrice}
            oldProductPrice={product.originalPrice}
            minQuentity={product.MinQuantity}
            pid={product._id}
            ModelNumber={product.modelNumber}
          />
        ))}
      </div>

      {/* View All Products Button */}
      <div className="text-center mt-8">
        <Link to={'/ViewAllProduct'}>
          <button className="px-6 py-2 border border-amber-500 text-amber-500 rounded-md hover:bg-amber-500 hover:text-white transition-colors">
            View All Products
          </button>
        </Link>
      </div>
    </div>
  );
}

export default CatagoryProducts;
