import React, { useState, useEffect } from 'react';
import BestProductCard, { BestProductCardSkeleton } from './BestProdcutCard';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Diamond } from 'lucide-react';

function BestProduct() {
  const [bestProducts, setBestProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`${import.meta.env.VITE_API_URL}/getbestproductlist`)
      .then((res) => {
        setBestProducts(res.data);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);


  return (
    <div className="container mx-auto px-4 sm:px-6 py-12" id='bestProduct'>
      {/* Crystal Themed Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col items-center mb-12"
      >
        <div className="flex items-center gap-4 mb-2">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-amber-500" />
          <Diamond size={16} className="text-amber-500 fill-amber-500/20" />
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-amber-500" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 uppercase tracking-tighter text-center">
          Our Best Sellers
        </h2>
        <p className="text-zinc-500 text-xs sm:text-sm mt-2 tracking-widest uppercase font-bold">
          Most Loved Crystal Treasures
        </p>
      </motion.div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
        {loading ? (
          // Shimmer Skeletons
          [...Array(4)].map((_, i) => <BestProductCardSkeleton key={i} />)
        ) : (
          bestProducts.map((product, idx) => {
            let firstSizePrice = product.dollarPrice;
            let sizeLabel = null;

            if (product.sizes && product.sizes.length > 0) {
              firstSizePrice = product.sizes[0].price;
              sizeLabel = product.sizes[0];
            }

            return (
              <div key={product._id} className="w-full">
                <BestProductCard
                  pid={product._id}
                  productImg={product.mainImage.url}
                  productName={product.productName}
                  productAbout={product.description}
                  ProductPrice={firstSizePrice}
                  productMinQuentity={product.MinQuantity}
                  ModelNumber={product.modelNumber}
                  size={sizeLabel}
                  category={product.category}
                  index={idx}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  )
}

export default BestProduct