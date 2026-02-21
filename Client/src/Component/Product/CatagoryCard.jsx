import React from 'react';

// ── Skeleton Loader (Crystal Shape — Light Border Style) ──
export const CategoryCardSkeleton = () => (
  <div className="w-[170px] h-[210px] bg-white relative shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-200"
    style={{ clipPath: 'polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)' }}
  >
    {/* Shimmer overlay */}
    <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0 -translate-x-full"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.02), rgba(255,255,255,0.6), rgba(0,0,0,0.02), transparent)',
          animation: 'skeleton-shimmer 1.5s infinite',
        }}
      />
    </div>
    <style>{`
      @keyframes skeleton-shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
    `}</style>
  </div>
);

const CategoryCard = ({ category, index = 0 }) => {
  // Crystal gem faceted shape
  const crystalShape = 'polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)';

  return (
    <a
      href={`/catagory/${encodeURIComponent(category.category)}`}
      className="category-card-link block relative w-[170px] h-[210px] group flex-shrink-0 transition-transform duration-500 hover:-translate-y-2"
      style={{ textDecoration: 'none' }}
    >
      {/* Outer glow on hover */}
      <div
        className="absolute inset-[-4px] bg-gradient-to-br from-amber-400 via-amber-500 to-amber-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md"
        style={{ clipPath: crystalShape }}
      />

      {/* Amber border frame */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-amber-400 via-amber-200 to-amber-500 transition-all duration-300"
        style={{ clipPath: crystalShape }}
      />

      {/* Inner crystal container */}
      <div
        className="absolute inset-[2px] overflow-hidden"
        style={{ clipPath: crystalShape }}
      >
        {/* Background Image */}
        <img
          src={category.mainImage?.url || "/img/product1.jpg"}
          alt={category.category}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />

        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

        {/* Top facet highlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />

        {/* Shimmer sweep on hover */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 ease-in-out pointer-events-none"
        />

        {/* Bottom Content */}
        <div className="absolute bottom-[15%] left-0 right-0 px-6 text-center">
          <h3
            className="text-xs font-black text-white uppercase tracking-wider leading-tight drop-shadow-lg"
            style={{ color: 'white', textDecoration: 'none' }}
          >
            {category.category}
          </h3>
          <p className="text-[8px] text-amber-300 uppercase tracking-[0.15em] font-bold mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            ✦ Explore ✦
          </p>
        </div>
      </div>
    </a>
  );
};

export default CategoryCard;