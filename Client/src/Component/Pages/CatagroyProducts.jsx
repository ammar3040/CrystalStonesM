import React, { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import ProductCard, { ProductCardSkeleton } from '../Product/ProductCard';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';

function CatagoryProducts() {
  const { CatagoryName } = useParams();
  const catagoryName = decodeURIComponent(CatagoryName);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Pagination & filters
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  const limit = 12;

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch products from server-side paginated API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          catagoryName,
          page: currentPage.toString(),
          limit: limit.toString(),
          sortBy,
          sortOrder,
        });

        if (debouncedSearch.trim()) {
          params.set('search', debouncedSearch.trim());
        }

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/catagoryproduct?${params.toString()}`
        );

        const data = res.data;
        setProducts(data.products || []);
        setTotalCount(data.totalCount || 0);
        setTotalPages(data.totalPages || 0);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [catagoryName, currentPage, debouncedSearch, sortBy, sortOrder]);

  // Reset page on category change
  useEffect(() => {
    setCurrentPage(1);
    setSearchQuery('');
    setDebouncedSearch('');
    setSortBy('createdAt');
    setSortOrder('desc');
  }, [catagoryName]);

  const sortOptions = [
    { label: 'Newest', value: 'createdAt', order: 'desc' },
    { label: 'Oldest', value: 'createdAt', order: 'asc' },
    { label: 'Price: Low → High', value: 'dollarPrice', order: 'asc' },
    { label: 'Price: High → Low', value: 'dollarPrice', order: 'desc' },
    { label: 'Name: A → Z', value: 'productName', order: 'asc' },
    { label: 'Name: Z → A', value: 'productName', order: 'desc' },
  ];

  const currentSortLabel = sortOptions.find(
    (o) => o.value === sortBy && o.order === sortOrder
  )?.label || 'Newest';

  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <>
      <Helmet>
        <title>{catagoryName} | Crystal Stones Mart | Authentic Khambhat Akik</title>
        <link rel="canonical" href={`https://crystalstonesmart.com/catagory/${CatagoryName}`} />
        <meta
          name="description"
          content={`Explore our premium ${catagoryName} collection. Certified Khambhat Akik, natural healing crystals, and high-quality stone products. Wholesale prices available.`}
        />
        <meta
          name="keywords"
          content={`${catagoryName}, Khambhat ${catagoryName}, handmade ${catagoryName}, authentic agate, healing crystals Khambhat, wholesale gemstones India, natural stone products, certified crystals`}
        />
        <meta property="og:title" content={`${catagoryName} | Crystal Stones Mart`} />
        <meta property="og:description" content={`Shop high-quality ${catagoryName} and natural healing crystals from Crystal Stones Mart, Khambhat.`} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        {/* Category Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-amber-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
            <span className="w-8 h-[1px] bg-amber-400" />
            <span>Collection</span>
            <span className="w-8 h-[1px] bg-amber-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tight">
            {catagoryName}
          </h2>
          {!loading && (
            <p className="text-sm text-gray-400 mt-2">{totalCount} products found</p>
          )}
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-8 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search in ${catagoryName}...`}
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-amber-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-300 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-amber-200/60 rounded-xl text-sm font-medium text-gray-700 hover:border-amber-400 transition-all"
            >
              <SlidersHorizontal size={14} />
              {currentSortLabel}
              <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {showFilters && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-amber-100 rounded-xl shadow-xl z-20 overflow-hidden">
                {sortOptions.map((option) => (
                  <button
                    key={`${option.value}-${option.order}`}
                    onClick={() => {
                      setSortBy(option.value);
                      setSortOrder(option.order);
                      setCurrentPage(1);
                      setShowFilters(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${sortBy === option.value && sortOrder === option.order
                      ? 'bg-amber-50 text-amber-700 font-bold'
                      : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {loading
            ? [...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)
            : products.length === 0
              ? <div className="col-span-full text-center py-12 text-gray-500">
                {debouncedSearch
                  ? `No products found for "${debouncedSearch}" in ${catagoryName}`
                  : `No products found in this category`}
              </div>
              : products.map((product) => {
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
                    dollarPrice={product.dollarPrice}
                    minQuentity={product?.MinQuantity || 1}
                    pid={product?._id}
                    ModelNumber={product?.modelNumber || ''}
                    category={product?.category || catagoryName}
                    size={sizeLabel}
                  />
                );
              })
          }
        </div>

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setCurrentPage(prev => Math.max(1, prev - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-amber-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-amber-50 hover:border-amber-400 disabled:opacity-40 transition-all"
            >
              ← Prev
            </button>

            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                return (
                  <button
                    key={page}
                    onClick={() => {
                      setCurrentPage(page);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
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
              onClick={() => {
                setCurrentPage(prev => Math.min(totalPages, prev + 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border border-amber-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-amber-50 hover:border-amber-400 disabled:opacity-40 transition-all"
            >
              Next →
            </button>
          </div>
        )}

        {/* View All Products Button */}
        {!loading && (
          <div className="text-center mt-8">
            <Link to={'/ViewAllProduct'}>
              <button className="px-6 py-2.5 border-2 border-amber-500 text-amber-600 rounded-xl font-bold text-sm hover:bg-amber-500 hover:text-white transition-all uppercase tracking-wider">
                View All Products
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

export default CatagoryProducts;