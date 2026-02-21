import React from 'react';
import { Phone, Mail, MessageSquare, Gem, Diamond, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-zinc-950 text-white overflow-hidden pt-16">
      {/* ── Faceted Top Border — Crystal Theme ── */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-60"
        style={{ clipPath: 'polygon(0 0, 100% 0, 95% 100%, 5% 100%)' }}
      />

      {/* Background Decorations */}
      <div className="absolute top-20 right-[-5%] w-64 h-64 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-20 left-[-5%] w-64 h-64 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-zinc-900">

          {/* 1. Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center">
              <a href="/">
                <img
                  src="https://res.cloudinary.com/dioicxwct/image/upload/v1771661574/crystal_stones_mart_logo-removebg-preview_f5fkqc_c_crop_ar_16_9_sbzdm9.png"
                  alt="Crystal Stones Mart"
                  className="h-16 object-contain brightness-0 invert"
                />
              </a>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-xs">
              Since 1992, Crystal Stones Mart has been the premier manufacturer of certified healing crystals and authentic Akik Khambhat treasures. We manufacture, export, and import premium natural agate stones and gemstone jewelry from the heart of Khambhat, Gujarat.
            </p>
            <div className="flex items-center gap-2 text-amber-500/80 text-[10px] font-bold uppercase tracking-widest">
              <ShieldCheck size={14} /> Certified Authenticity
            </div>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
              <span className="w-4 h-[1px] bg-amber-500" /> Navigation
            </h4>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="group flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm">
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-amber-500" /> Home
                </Link>
              </li>
              <li>
                <Link to="/ViewAllProduct" className="group flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm">
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-amber-500" /> All Products
                </Link>
              </li>
              <li>
                <Link to="/#contactForm" className="group flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm">
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-amber-500" /> Contact Us
                </Link>
              </li>
              <li>
                <Link to="/#bestProduct" className="group flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm">
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-amber-500" /> Best Sellers
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Why Choose Us */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
              <span className="w-4 h-[1px] bg-amber-500" /> Why Choose Us
            </h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <div className="p-2 bg-zinc-900 rounded-lg text-amber-500">
                  <Gem size={16} />
                </div>
                <div>
                  <span className="block text-xs font-bold text-white uppercase tracking-wider">Authentic Products</span>
                  <span className="text-[10px] text-zinc-500">Directly sourced & crafted</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-2 bg-zinc-900 rounded-lg text-amber-500">
                  <Truck size={16} />
                </div>
                <div>
                  <span className="block text-xs font-bold text-white uppercase tracking-wider">Bulk Delivery</span>
                  <span className="text-[10px] text-zinc-500">Pan India wholesale logistics</span>
                </div>
              </li>
            </ul>
          </div>

          {/* 4. Contact */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
              <span className="w-4 h-[1px] bg-amber-500" /> Get in Touch
            </h4>
            <div className="space-y-6">
              <a href="tel:+919016507258" className="group block">
                <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-1 group-hover:text-amber-500 transition-colors">Call Support</span>
                <span className="flex items-center gap-2 text-sm font-bold group-hover:translate-x-1 transition-transform">
                  <Phone size={16} className="text-amber-500" /> +91 90165 07258
                </span>
              </a>
              <a href="mailto:crystalstonesmart@gmail.com" className="group block">
                <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-1 group-hover:text-amber-500 transition-colors">Email Us</span>
                <span className="flex items-center gap-2 text-sm font-bold group-hover:translate-x-1 transition-transform truncate">
                  <Mail size={16} className="text-amber-500" /> support@crystalstonesmart.in
                </span>
              </a>
              <a
                href="https://wa.me/919016507258?text=Hi, I'm interested in buying your crystal products in bulk."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#128C7E] text-white text-[11px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-green-500/20 transition-all hover:scale-105"
              >
                <MessageSquare size={16} /> WhatsApp Inquiry
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="py-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em]">
              &copy; {currentYear} Crystal Stones Mart. All rights reserved.
            </p>
            <p className="text-[8px] text-zinc-600 mt-1 uppercase tracking-widest leading-relaxed">
              Empowering India's wholesale crystal business with trust & authenticity.
            </p>
          </div>
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-6 h-6 rotate-45 border border-zinc-800 flex items-center justify-center">
                <div className="w-1 h-1 bg-amber-500/20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;