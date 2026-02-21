import React, { useEffect, useState } from 'react';
import ProductCard, { ProductCardSkeleton } from '../Product/ProductCard';
import { Link } from 'react-router-dom';
import { ArrowRight, Gem } from 'lucide-react';
import { motion } from 'framer-motion';

function ViewAllMainProduct() {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/all?limit=8`);
        const data = await response.json();
        const products = data.products || [];

        if (Array.isArray(products)) {
          setAllProducts(shuffleArray(products));
        } else {
          setError('Invalid product data received');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto">
      {/* Section Header — Crystal Theme */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 text-amber-700 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
          <span className="w-8 h-[1px] bg-amber-400"></span>
          <Gem size={14} className="text-amber-500" />
          <span>Handpicked Collection</span>
          <Gem size={14} className="text-amber-500" />
          <span className="w-8 h-[1px] bg-amber-400"></span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tight uppercase">
          Crystal & Agate Treasures
        </h2>
        <div className="flex items-center justify-center gap-2 mt-3">
          <span className="w-12 h-[1px] bg-gradient-to-r from-transparent to-amber-400"></span>
          <span className="w-2 h-2 bg-amber-400 rotate-45"></span>
          <span className="w-12 h-[1px] bg-gradient-to-l from-transparent to-amber-400"></span>
        </div>
      </motion.div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {loading
          ? [...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)
          : allProducts.slice(0, 8).map((product, idx) => {
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
                  minQuentity={product?.MinQuantity || 1}
                  pid={product?._id}
                  ModelNumber={product?.modelNumber || ''}
                  category={product?.category || ''}
                  size={sizeLabel}
                  index={idx}
                />
              </div>
            );
          })
        }
      </div>

      {/* View All Button — Crystal Theme */}
      {!loading && allProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex justify-center mt-10"
        >
          <Link
            to="/ViewAllProduct"
            className="inline-flex items-center gap-2 px-10 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-black uppercase tracking-wider rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 hover:-translate-y-0.5 active:scale-95 border border-amber-400/30"
          >
            View All Products <ArrowRight size={16} />
          </Link>
        </motion.div>
      )}
    </div>
  );
}

export default ViewAllMainProduct;