import React, { useEffect, useState } from 'react';
import ProductCard, { ProductCardSkeleton } from '../Product/ProductCard';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const RandomTreasures = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        const fetchRandomProducts = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/all?limit=50`);
                const data = await response.json();
                const allProducts = data.products || [];

                // Shuffle and take 8
                const shuffled = [...allProducts].sort(() => 0.5 - Math.random()).slice(0, 8);
                setProducts(shuffled);
            } catch (error) {
                console.error("Error fetching random treasures:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRandomProducts();
    }, [refresh]);

    return (
        <section className="py-20 px-4 bg-white relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-amber-100/30 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-50/50 blur-3xl rounded-full translate-x-1/3 translate-y-1/3" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-left"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                            <Sparkles size={12} />
                            <span>Curated Variety</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight">
                            Discover <span className="text-amber-600">Random</span> Treasures
                        </h2>
                        <p className="text-gray-500 mt-2 max-w-xl">
                            Every click reveals something unique. Explore our diverse collection of handcrafted stones and healing crystals from Khambhat.
                        </p>
                    </motion.div>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/ViewAllProduct"
                            className="hidden sm:flex items-center gap-2 px-6 py-3 border-2 border-amber-500/20 text-amber-700 rounded-xl font-bold text-sm tracking-wide hover:bg-amber-50 transition-all"
                        >
                            View All Products
                            <ArrowRight size={16} />
                        </Link>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setRefresh(prev => prev + 1)}
                            className="flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-xl font-bold text-sm tracking-wide hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
                        >
                            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                            Shuffle Treasures
                        </motion.button>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {loading ? (
                        [...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)
                    ) : (
                        products.map((product, idx) => (
                            <ProductCard
                                key={product._id}
                                productImg={product?.mainImage?.url || '/fallback.png'}
                                productName={product?.productName || 'No Name'}
                                productAbout={product?.description || 'No description available'}
                                ProductPrice={product.sizes?.[0]?.price || product.dollarPrice}
                                dollarPrice={product.dollarPrice}
                                minQuentity={product?.MinQuantity || 1}
                                pid={product?._id}
                                ModelNumber={product?.modelNumber || ''}
                                category={product?.category || ''}
                                index={idx}
                            />
                        ))
                    )}
                </div>

                {/* Mobile View All Button */}
                <div className="mt-8 text-center sm:hidden">
                    <Link
                        to="/ViewAllProduct"
                        className="inline-flex items-center gap-2 px-10 py-4 bg-amber-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-amber-500/20 active:scale-95 transition-all"
                    >
                        View All Products
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default RandomTreasures;
