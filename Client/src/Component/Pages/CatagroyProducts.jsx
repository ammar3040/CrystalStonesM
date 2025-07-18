import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../Product/ProductCard';
import axios from 'axios';

function CatagoryProducts() {
  const { CatagoryName } = useParams();
  const catagoryName = decodeURIComponent(CatagoryName);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/catagoryproduct/?catagoryName=${catagoryName}`
        );
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [catagoryName]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (products.length === 0) return <div className="text-center py-8">No products found in this category</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-center mb-8">Explore Our {catagoryName} Collection</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {products.map((product) => {
          // Handle size data
          let firstSizePrice = product.dollarPrice;
          let sizeLabel = null;

          if (product.sizes && product.sizes.length > 0) {
            firstSizePrice = product.sizes[0].price;
            sizeLabel = product.sizes[0];
          }

          return (
            <ProductCard
              key={product._id}
              productImg={product?.mainImage?.url || '/fallback.png'}
              productName={product?.productName || 'No Name'}
              productAbout={product?.description || 'No description available'}
              ProductPrice={firstSizePrice}
              oldProductPrice={product?.originalPrice || 0}
               dollarPrice={product.dollarPrice}
              minQuentity={product?.MinQuantity || 1}
              pid={product?._id}
              ModelNumber={product?.modelNumber || ''}
              size={sizeLabel} // Pass size data to ProductCard
            />
          );
        })}
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