import React, { useEffect, useState } from 'react';
import ProductCard from '../Product/ProductCard';
import { Link } from 'react-router-dom';

function ViewAllProduct() {
  const [allProducts, setAllProducts] = useState([]);

  // Shuffle function
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/all`);
        const data = await response.json();

        // Check if data is an array before proceeding
        if (Array.isArray(data)) {
          const shuffledProducts = shuffleArray(data);
          setAllProducts(shuffledProducts);
        } else {
          console.error('Invalid product data:', data);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    fetchAllProducts();
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-center my-8">All Products</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {allProducts.map((product) => (
             <Link to={`/Product/${product._id}`} key={product._id}>
          <div key={product._id} className="w-full">
            <ProductCard
              productImg={product?.mainImage?.url || '/fallback.png'} // Prevent crash
              productName={product?.productName || 'No Name'}
              productAbout={product?.description || 'No description available'}
              ProductPrice={product?.discountedPrice || 0}
              oldProductPrice={product?.originalPrice || 0}
              minQuentity={product?.MinQuantity || 1}
              pid={product?._id}
            />
          </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ViewAllProduct;
