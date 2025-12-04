import React, { useEffect, useState } from 'react';
import ProductCard from '../Product/ProductCard';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import ProductRichSnippet from './ProductRichSnippet';
function ViewAllProduct() {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          setError('Invalid product data received');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (allProducts.length === 0) return <div className="text-center py-8">No products found</div>;

  return (
    <>
      <ProductRichSnippet/>
     <ProductRichSnippet/>
     <Helmet>
        <title>All Products | Crystal Stones mart</title>
        <link rel="canonical" href="https://crystalstonesmart.com/ViewAllProduct" />
       <meta
          name="keywords"
          content="Khambhat agate, handmade agate, agate stones, crystal products, healing stones, chakra stones, gemstone, crystal jewelry"
        />
      </Helmet>
    <div className="px-4 sm:px-6 lg:px-8 py-8">
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
        Explore Handpicked Crystal & Agate Treasures
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {allProducts.map((product) => {
          // Handle size data
          let firstSizePrice = product.dollarPrice;
          let sizeLabel = null;

          if (product.sizes && product.sizes.length > 0) {
            firstSizePrice = product.sizes[0].price;
            sizeLabel = product.sizes[0];
          }

          return (
            <div key={product._id} className="w-full">
              <ProductCard
                productImg={product?.mainImage?.url || '/fallback.png'}
                productName={product?.productName || 'No Name'}
                productAbout={product?.description || 'No description available'}
                ProductPrice={firstSizePrice}
                dollarPrice={product.dollarPrice}
                oldProductPrice={product?.originalPrice || 0}
                minQuentity={product?.MinQuantity || 1}
                pid={product?._id}
                ModelNumber={product?.modelNumber || ''}
                size={sizeLabel} // Pass the size data to ProductCard
              />
            </div>
          );
        })}
      </div>
    </div>
    </>
  );
}

export default ViewAllProduct;
