import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Lock, Eye, EyeOff, ArrowRight, Gem, X } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

/* ─── Crystal SVG Accents ─── */
const CrystalShard = ({ className, style }) => (
  <svg viewBox="0 0 80 120" fill="none" className={className} style={style}>
    <path d="M40 0L72 45L55 120L25 120L8 45L40 0Z" fill="url(#sg1)" opacity="0.12" />
    <path d="M40 0L72 45L55 120L25 120L8 45L40 0Z" stroke="url(#sg2)" strokeWidth="0.5" opacity="0.3" />
    <path d="M40 0L55 120M40 0L25 120M8 45L72 45" stroke="url(#sg2)" strokeWidth="0.3" opacity="0.15" />
    <defs>
      <linearGradient id="sg1" x1="40" y1="0" x2="40" y2="120"><stop offset="0%" stopColor="#f59e0b" /><stop offset="100%" stopColor="#92400e" /></linearGradient>
      <linearGradient id="sg2" x1="40" y1="0" x2="40" y2="120"><stop offset="0%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#d97706" /></linearGradient>
    </defs>
  </svg>
);

const GeodeCross = ({ className, style }) => (
  <svg viewBox="0 0 100 100" fill="none" className={className} style={style}>
    <polygon points="50,5 60,40 95,50 60,60 50,95 40,60 5,50 40,40" fill="url(#gc1)" opacity="0.08" />
    <polygon points="50,5 60,40 95,50 60,60 50,95 40,60 5,50 40,40" stroke="url(#gc2)" strokeWidth="0.5" opacity="0.2" />
    <defs>
      <linearGradient id="gc1" x1="50" y1="5" x2="50" y2="95"><stop offset="0%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#78350f" /></linearGradient>
      <linearGradient id="gc2" x1="5" y1="50" x2="95" y2="50"><stop offset="0%" stopColor="#fcd34d" /><stop offset="100%" stopColor="#d97706" /></linearGradient>
    </defs>
  </svg>
);

const floatingCrystals = [
  { Component: CrystalShard, top: '10%', left: '5%', size: 'w-14 h-20', rotate: -15, delay: 0 },
  { Component: GeodeCross, top: '20%', right: '6%', size: 'w-16 h-16', rotate: 20, delay: 1.2 },
  { Component: CrystalShard, bottom: '15%', left: '8%', size: 'w-10 h-16', rotate: 25, delay: 2 },
  { Component: GeodeCross, bottom: '20%', right: '10%', size: 'w-12 h-12', rotate: -10, delay: 0.8 },
  { Component: CrystalShard, top: '55%', left: '3%', size: 'w-8 h-14', rotate: 35, delay: 2.5 },
];

/* ─── Reusable Input Component ─── */
const GlassInput = ({ icon: Icon, focused, name, onFocus, onBlur, ...props }) => (
  <div className="relative group">
    <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focused === name ? 'text-amber-400' : 'text-zinc-500'}`}>
      <Icon size={18} />
    </div>
    <input
      name={name}
      onFocus={onFocus}
      onBlur={onBlur}
      className="w-full pl-12 pr-4 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-zinc-500 outline-none transition-all duration-300 focus:border-amber-500/40 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(245,158,11,0.08)]"
      {...props}
    />
  </div>
);

/* ─── Main SignUp Component ─── */
const SignUpMain = ({ onClose }) => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focused, setFocused] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Uname: '', email: '', mobile: '', address: '', password: '', confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/register`, formData);
      if (response.data.success) {
        toast.success(response.data.message || "Registration Successful!");

        const user = response.data.user;
        if (user && !user.uid && user.id) user.uid = user.id;

        // Update context immediately if token is provided
        if (response.data.token) {
          login(user, response.data.token);
        }

        setTimeout(() => { if (onClose) onClose(); navigate('/'); }, 1500);
      } else {
        toast.error(response.data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
      onClick={(e) => { if (e.target === e.currentTarget && onClose) onClose(); }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-amber-950/40 z-0" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-500/8 rounded-full blur-[180px] z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-600/6 rounded-full blur-[150px] z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-400/5 rounded-full blur-[200px] z-0 animate-pulse" />
      <div className="absolute inset-0 opacity-[0.025] z-[1] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      {/* Floating Crystals */}
      <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
        {floatingCrystals.map((crystal, i) => {
          const { Component, size, rotate, delay, ...pos } = crystal;
          return (
            <motion.div key={i} className={`absolute ${size}`} style={{ ...pos, rotate: `${rotate}deg` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 0.7, 0.3], y: [0, -20, 0], rotate: [rotate, rotate + 8, rotate] }}
              transition={{ duration: 10 + i * 1.5, repeat: Infinity, delay, ease: 'easeInOut' }}
            >
              <Component className="w-full h-full" />
            </motion.div>
          );
        })}
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-lg mx-4 rounded-3xl overflow-hidden shadow-2xl shadow-black/40 bg-white/[0.04] border border-white/[0.08] p-8 sm:p-10"
        style={{ backdropFilter: 'blur(40px)' }}
      >
        {/* Close Button */}
        {onClose && (
          <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/[0.06] border border-white/[0.1] text-zinc-400 hover:text-white hover:bg-white/[0.12] transition-all duration-200">
            <X size={18} />
          </button>
        )}

        {/* Brand */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-xl border border-amber-500/20">
            <Gem className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm tracking-wider uppercase">Crystal Stones</h3>
            <p className="text-amber-500/70 text-[10px] font-semibold tracking-[0.3em] uppercase">Mart</p>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-6">
          <h2 className="text-3xl font-black text-white tracking-tight">Create Account</h2>
          <p className="text-zinc-400 text-sm mt-2">Join our premium crystal community</p>
        </motion.div>

        {/* Form */}
        <motion.form onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="space-y-4">
          <GlassInput icon={User} name="Uname" type="text" placeholder="Full Name" value={formData.Uname} onChange={handleChange} focused={focused} onFocus={() => setFocused('Uname')} onBlur={() => setFocused('')} required />
          <GlassInput icon={Mail} name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} focused={focused} onFocus={() => setFocused('email')} onBlur={() => setFocused('')} required />
          <GlassInput icon={Phone} name="mobile" type="tel" placeholder="Mobile Number" value={formData.mobile} onChange={handleChange} maxLength={10} focused={focused} onFocus={() => setFocused('mobile')} onBlur={() => setFocused('')} required />
          <GlassInput icon={MapPin} name="address" type="text" placeholder="Address" value={formData.address} onChange={handleChange} focused={focused} onFocus={() => setFocused('address')} onBlur={() => setFocused('')} required />

          {/* Password */}
          <div className="relative group">
            <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focused === 'password' ? 'text-amber-400' : 'text-zinc-500'}`}><Lock size={18} /></div>
            <input className="w-full pl-12 pr-12 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-zinc-500 outline-none transition-all duration-300 focus:border-amber-500/40 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(245,158,11,0.08)]" type={showPassword ? 'text' : 'password'} name="password" placeholder="Password" value={formData.password} onChange={handleChange} onFocus={() => setFocused('password')} onBlur={() => setFocused('')} required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-amber-400 transition-colors">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative group">
            <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focused === 'confirmPassword' ? 'text-amber-400' : 'text-zinc-500'}`}><Lock size={18} /></div>
            <input className="w-full pl-12 pr-12 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-zinc-500 outline-none transition-all duration-300 focus:border-amber-500/40 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(245,158,11,0.08)]" type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} onFocus={() => setFocused('confirmPassword')} onBlur={() => setFocused('')} required />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-amber-400 transition-colors">
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Submit */}
          <motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl text-white font-bold text-sm uppercase tracking-widest shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group relative overflow-hidden mt-2"
          >
            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12" />
            <span className="relative">{isSubmitting ? 'Creating Account...' : 'Create Account'}</span>
            {!isSubmitting && <ArrowRight size={16} className="relative group-hover:translate-x-1 transition-transform" />}
          </motion.button>
        </motion.form>

        {/* Login Link */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-6 flex items-center justify-center gap-2">
          <span className="text-zinc-500 text-sm">Already have an account?</span>
          <Link to="/SignInPage" onClick={() => onClose?.()}>
            <span className="text-amber-400 text-sm font-bold hover:text-amber-300 transition-colors cursor-pointer">Sign In</span>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default SignUpMain;
