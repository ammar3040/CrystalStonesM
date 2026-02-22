import React, { useEffect, useState } from 'react';
import ProductCard, { ProductCardSkeleton } from '../Product/ProductCard';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import ProductRichSnippet from './ProductRichSnippet';

function ViewAllProduct() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get('search') || '';

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const limit = 12;

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const fetchAllProducts = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/all?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
      const data = await response.json();

      if (data.products && Array.isArray(data.products)) {
        setAllProducts(data.products);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.currentPage || 1);
      } else if (data.error) {
        console.error('API Error:', data.error);
        setError(`API Error: ${data.error}`);
      } else {
        console.error('Invalid product data structure:', data);
        setError('Invalid product data received - check console for details');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchAllProducts(currentPage, searchQuery);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [currentPage, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchAllProducts(1, searchQuery);
  };

  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <>
      <ProductRichSnippet />
      <Helmet>
        <title>All Products | Crystal Stones mart</title>
        <link rel="canonical" href="https://crystalstonesmart.com/ViewAllProduct" />
        <meta
          name="keywords"
          content="Khambhat agate, handmade agate, agate stones, crystal products, healing stones, chakra stones, gemstone, crystal jewelry"
        />
      </Helmet>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#2d3748',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            Crystal & Agate Treasures
          </h2>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-amber-200/60 rounded-full bg-white/80 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-300 transition-all"
            />
            <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2">
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 512 512">
                <path fill="currentColor" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
              </svg>
            </button>
          </form>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {loading
            ? [...Array(limit)].map((_, i) => <ProductCardSkeleton key={i} />)
            : allProducts.length === 0
              ? <div className="col-span-full text-center py-8 text-gray-500">No products found</div>
              : allProducts.map((product, index) => {
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
                      size={sizeLabel}
                      index={index}
                    />
                  </div>
                );
              })
          }
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-2 flex-wrap">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-amber-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-amber-50 hover:border-amber-400 disabled:opacity-40 transition-all"
            >
              ← Prev
            </button>

            {/* Page numbers */}
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              // Show first, last, current, and neighbors
              if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${currentPage === page
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                      : 'bg-white border border-amber-200 text-gray-700 hover:bg-amber-50'
                      }`}
                  >
                    {page}
                  </button>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return <span key={page} className="text-gray-400 px-1">...</span>;
              }
              return null;
            })}

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border border-amber-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-amber-50 hover:border-amber-400 disabled:opacity-40 transition-all"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default ViewAllProduct;
