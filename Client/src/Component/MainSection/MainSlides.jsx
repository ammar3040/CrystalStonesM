import React from 'react';
import { MessageCircle, ArrowRight, Sparkles, Diamond, ShieldCheck, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

function MainSlides() {
  // Floating fragments for brand depth
  const fragments = [
    { top: '15%', left: '15%', size: 24, delay: 0 },
    { top: '20%', left: '80%', size: 32, delay: 1.5 },
    { top: '75%', left: '20%', size: 18, delay: 3 },
    { top: '85%', left: '75%', size: 14, delay: 0.5 },
    { top: '45%', left: '10%', size: 20, delay: 2.2 },
    { top: '55%', left: '90%', size: 28, delay: 1.2 },
  ];

  return (
    <section className="relative w-full h-full overflow-hidden bg-zinc-950 flex items-center justify-center">
      {/* Premium Multi-layer Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-amber-950/30 z-10"></div>

      {/* Dynamic Brand Aura (Pulsing center glow) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[1000px] max-h-[600px] bg-amber-500/10 blur-[150px] rounded-full z-0 animate-pulse opacity-60" />

      {/* Atmospheric Particles / Shards */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {fragments.map((frag, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.1, 0.4, 0.1],
              y: [0, -30, 0],
              x: [0, 15, 0],
              rotate: [0, 90, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 8 + i,
              repeat: Infinity,
              delay: frag.delay,
              ease: "easeInOut"
            }}
            style={{ top: frag.top, left: frag.left }}
            className="absolute"
          >
            <Diamond size={frag.size} className="text-amber-500/20" />
          </motion.div>
        ))}
      </div>

      {/* Main Content Area - Centered Brand Intro */}
      <div className="relative z-20 w-full max-w-5xl mx-auto px-6 text-center pt-24 sm:pt-32 lg:pt-40">
        <div className="space-y-8 lg:space-y-12">

          {/* Brand Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="inline-flex flex-col items-center"
          >
            <div className="flex items-center gap-3 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-amber-500 text-[10px] font-black uppercase tracking-[0.5em]">
              Established 1992
            </div>
          </motion.div>

          {/* Majestic Heading */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl sm:text-7xl lg:text-9xl font-black text-white leading-[0.9] tracking-tightest"
            >
              CRYSTAL <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-400 to-amber-100 drop-shadow-[0_0_30px_rgba(251,191,36,0.3)]">
                STONES MART
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: '100px' }}
              transition={{ duration: 1.5, delay: 0.8 }}
              className="h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto"
            />
          </div>

          {/* Value Propositions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1 }}
            className="flex flex-wrap justify-center gap-6 lg:gap-12"
          >
            <div className="flex items-center gap-3 text-zinc-400 font-bold uppercase tracking-widest text-[11px]">
              <ShieldCheck className="text-amber-500" size={16} /> 100% Genuine
            </div>
            <div className="flex items-center gap-3 text-zinc-400 font-bold uppercase tracking-widest text-[11px]">
              <MapPin className="text-amber-500" size={16} /> Khambhat, India
            </div>
            <div className="flex items-center gap-3 text-zinc-400 font-bold uppercase tracking-widest text-[11px]">
              <Sparkles className="text-amber-500" size={16} /> Artisan Craft
            </div>
          </motion.div>

          {/* Brand Introduction Text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="text-base sm:text-xl lg:text-2xl text-zinc-300 max-w-3xl mx-auto leading-relaxed font-light italic"
          >
            "Connecting the world to the ancient energy of the Earth. We are your direct bridge to India's premier crystal legacy—offering hand-carved excellence and wholesale authenticity since 1992."
          </motion.p>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="flex flex-wrap justify-center gap-6 pt-8"
          >
            <a
              href="/ViewAllProduct"
              className="group relative px-12 py-5 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl overflow-hidden shadow-2xl shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12" />
              <span className="relative flex items-center gap-3 text-sm font-black text-white uppercase tracking-widest">
                Start Exploring <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </span>
            </a>

            <a
              href="https://wa.me/919016507258"
              target="_blank"
              rel="noopener noreferrer"
              className="group px-12 py-5 border border-white/10 hover:border-amber-500/50 rounded-2xl backdrop-blur-md transition-all hover:bg-white/5 active:scale-95"
            >
              <span className="flex items-center gap-3 text-sm font-black text-zinc-300 group-hover:text-amber-400 uppercase tracking-widest">
                <MessageCircle size={20} /> Bulk Inquiry
              </span>
            </a>
          </motion.div>

        </div>
      </div>

      {/* Decorative Shimmers */}
      <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-amber-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-amber-500/5 blur-[100px] pointer-events-none" />

      {/* Subtle Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-10"
        style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
    </section>
  );
}

export default MainSlides;