import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const optimizeImageUrl = (url) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  // Insert f_auto,q_auto into the path for automatic format and quality
  return url.replace('/upload/', '/upload/f_auto,q_auto/');
};

function ExtraSlides({ bgImg, productName, category, productId, index, description }) {
  // Hexagonal Crystal Shape
  const crystalShape = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';

  const optimizedBgImg = optimizeImageUrl(bgImg);

  return (
    <section className='relative w-full h-full overflow-hidden bg-zinc-900'>
      {/* Background with zoom effect overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 scale-110 opacity-55 blur-sm"
        style={{ backgroundImage: `url(${optimizedBgImg})` }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/50 to-transparent z-10"></div>

      {/* Content container */}
      <div className="relative z-20 w-full h-full flex items-center justify-center px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-20 w-full">

          {/* 1. Product Image — Crystal Point Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="md:w-1/2 flex justify-center"
          >
            <Link to={`/catagory/${encodeURIComponent(category)}`} className="group relative">
              {/* Glowing background */}
              <div className="absolute inset-0 bg-amber-500/20 blur-[60px] rounded-full group-hover:bg-amber-500/40 transition-all duration-700" />

              {/* Faceted Frame */}
              <div
                className="p-1.5 bg-gradient-to-tr from-amber-500 via-white/40 to-amber-200 relative overflow-hidden transition-transform duration-500 group-hover:scale-105 group-hover:rotate-2 shadow-2xl shadow-black/80"
                style={{ clipPath: crystalShape }}
              >
                <img
                  src={optimizedBgImg}
                  className="w-[240px] sm:w-[300px] md:w-[360px] aspect-square object-cover bg-zinc-900"
                  alt={productName}
                  style={{ clipPath: crystalShape }}
                  loading="lazy"
                  fetchpriority={index === 0 ? "high" : "low"}
                />

                {/* Shimmer Effect */}
                <motion.div
                  animate={{ x: ['-200%', '200%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
                />
              </div>
            </Link>
          </motion.div>

          {/* 2. Text Content */}
          <div className="md:w-1/2 text-center md:text-left space-y-6">
            {category && category !== 'undefined' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 text-amber-500 text-[10px] font-black uppercase tracking-[0.4em]"
              >
                <Sparkles size={12} /> {category}
              </motion.div>
            )}

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tighter uppercase"
            >
              {productName}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-sm sm:text-base text-zinc-300 max-w-md leading-relaxed line-clamp-3 italic"
            >
              {description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="pt-4"
            >
              <Link to={`/catagory/${encodeURIComponent(category)}`}>
                <button className="group flex items-center gap-3 px-8 py-3 bg-white text-black text-sm font-black uppercase tracking-widest rounded transition-all hover:bg-amber-400 hover:shadow-[0_0_30px_rgba(251,191,36,0.3)] active:scale-95">
                  Discover Collection <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ExtraSlides;