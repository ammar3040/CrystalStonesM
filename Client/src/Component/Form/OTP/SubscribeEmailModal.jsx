import React, { useState, useEffect, useRef } from 'react';
import { Mail, X, Gem, ArrowRight, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

/* ─── Crystal SVG Accent ─── */
const GeodeCross = ({ className, style }) => (
  <svg viewBox="0 0 100 100" fill="none" className={className} style={style}>
    <polygon points="50,5 60,40 95,50 60,60 50,95 40,60 5,50 40,40" fill="url(#modal-gc1)" opacity="0.08" />
    <polygon points="50,5 60,40 95,50 60,60 50,95 40,60 5,50 40,40" stroke="url(#modal-gc2)" strokeWidth="0.5" opacity="0.2" />
    <defs>
      <linearGradient id="modal-gc1" x1="50" y1="5" x2="50" y2="95"><stop offset="0%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#78350f" /></linearGradient>
      <linearGradient id="modal-gc2" x1="5" y1="50" x2="95" y2="50"><stop offset="0%" stopColor="#fcd34d" /><stop offset="100%" stopColor="#d97706" /></linearGradient>
    </defs>
  </svg>
);

const SubscribeEmailModal = ({ forceOpen = false, onClose }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const timerRef = useRef(null);
  const modalRef = useRef(null);

  const isSubscribed = () => {
    try {
      return document.cookie.split(';').some(cookie => cookie.trim().startsWith('subscribed=true'));
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };
    if (showPopup) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPopup]);

  useEffect(() => {
    if (forceOpen) { setShowPopup(true); return; }
    if (!isSubscribed()) {
      timerRef.current = setTimeout(() => setShowPopup(true), 7000);
    }
    return () => clearTimeout(timerRef.current);
  }, [forceOpen]);

  const handleClose = () => {
    setShowPopup(false);
    clearTimeout(timerRef.current);
    if (onClose) onClose();
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Subscribed successfully!');
        document.cookie = 'subscribed=true; path=/; max-age=2592000';
        handleClose();
      } else {
        throw new Error(data.message || 'Subscription failed');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]"
        >
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-xs mx-4 rounded-2xl overflow-hidden shadow-2xl shadow-black/50"
            style={{ backdropFilter: 'blur(40px)' }}
          >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-900 to-amber-950/30 z-0" />

            {/* Ambient Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-[80px] z-0" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-600/8 rounded-full blur-[60px] z-0" />

            {/* Crystal Accents */}
            <div className="absolute top-4 right-16 opacity-30 z-[1]">
              <GeodeCross className="w-10 h-10" style={{ transform: 'rotate(15deg)' }} />
            </div>
            <div className="absolute bottom-4 left-4 opacity-20 z-[1]">
              <GeodeCross className="w-8 h-8" style={{ transform: 'rotate(-20deg)' }} />
            </div>

            {/* Content */}
            <div className="relative z-10 p-6 border border-white/[0.08] rounded-2xl">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/[0.06] border border-white/[0.1] text-zinc-400 hover:text-white hover:bg-white/[0.12] transition-all duration-200"
              >
                <X size={16} />
              </button>

              {/* Icon */}
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="w-11 h-11 mx-auto mb-4 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/20 flex items-center justify-center"
              >
                <Bell className="w-5 h-5 text-amber-400" />
              </motion.div>

              {/* Heading */}
              <div className="text-center mb-4">
                <h3 className="text-lg font-black text-white tracking-tight mb-1">Stay Updated</h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Get exclusive offers on premium crystals & new arrivals.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmitEmail} className="space-y-3">
                <div className="relative">
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focused ? 'text-amber-400' : 'text-zinc-500'}`}>
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder="Enter your email"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-xs placeholder:text-zinc-500 outline-none transition-all duration-300 focus:border-amber-500/40 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(245,158,11,0.08)]"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12" />
                  <span className="relative">{isLoading ? 'Subscribing...' : 'Subscribe'}</span>
                  {!isLoading && <ArrowRight size={16} className="relative group-hover:translate-x-1 transition-transform" />}
                </motion.button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/10" />
                <span className="text-zinc-500 text-xs font-medium uppercase tracking-widest">or</span>
                <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/10" />
              </div>

              {/* Google Sign In */}
              <a href={`${import.meta.env.VITE_API_URL}/api/google`}>
                <button className="w-full py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-zinc-300 text-xs font-medium flex items-center justify-center gap-2 hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300 group">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                  </svg>
                  <span className="group-hover:text-white transition-colors">Sign in with Google</span>
                </button>
              </a>

              {/* Privacy Note */}
              <p className="text-zinc-600 text-[10px] text-center mt-3">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SubscribeEmailModal;