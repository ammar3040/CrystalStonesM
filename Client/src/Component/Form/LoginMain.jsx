import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Gem, X } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../lib/api';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';

/* ─── Premium Crystal SVG Components ─── */

const CrystalShard = ({ className, style }) => (
  <svg viewBox="0 0 80 120" fill="none" className={className} style={style}>
    <path d="M40 0L72 45L55 120L25 120L8 45L40 0Z" fill="url(#crystalGrad)" opacity="0.12" />
    <path d="M40 0L72 45L55 120L25 120L8 45L40 0Z" stroke="url(#crystalStroke)" strokeWidth="0.5" opacity="0.3" />
    <path d="M40 0L55 120M40 0L25 120M8 45L72 45" stroke="url(#crystalStroke)" strokeWidth="0.3" opacity="0.15" />
    <defs>
      <linearGradient id="crystalGrad" x1="40" y1="0" x2="40" y2="120">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#92400e" />
      </linearGradient>
      <linearGradient id="crystalStroke" x1="40" y1="0" x2="40" y2="120">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
    </defs>
  </svg>
);

const CrystalCluster = ({ className, style }) => (
  <svg viewBox="0 0 200 180" fill="none" className={className} style={style}>
    <path d="M80 180L60 60L100 0L140 60L120 180H80Z" fill="url(#clusterMain)" opacity="0.08" />
    <path d="M80 180L60 60L100 0L140 60L120 180H80Z" stroke="url(#clusterStroke)" strokeWidth="0.5" opacity="0.2" />
    <path d="M100 0L120 180M100 0L80 180M60 60L140 60" stroke="url(#clusterStroke)" strokeWidth="0.3" opacity="0.1" />
    <path d="M30 180L20 100L50 50L70 100L55 180H30Z" fill="url(#clusterSide)" opacity="0.06" />
    <path d="M30 180L20 100L50 50L70 100L55 180H30Z" stroke="url(#clusterStroke)" strokeWidth="0.4" opacity="0.15" />
    <path d="M145 180L155 110L175 70L190 110L170 180H145Z" fill="url(#clusterSide)" opacity="0.06" />
    <path d="M145 180L155 110L175 70L190 110L170 180H145Z" stroke="url(#clusterStroke)" strokeWidth="0.4" opacity="0.15" />
    <defs>
      <linearGradient id="clusterMain" x1="100" y1="0" x2="100" y2="180">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#78350f" />
      </linearGradient>
      <linearGradient id="clusterSide" x1="50" y1="50" x2="50" y2="180">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#451a03" />
      </linearGradient>
      <linearGradient id="clusterStroke" x1="100" y1="0" x2="100" y2="180">
        <stop offset="0%" stopColor="#fcd34d" />
        <stop offset="50%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#92400e" />
      </linearGradient>
    </defs>
  </svg>
);

const GeodeCross = ({ className, style }) => (
  <svg viewBox="0 0 100 100" fill="none" className={className} style={style}>
    <polygon points="50,5 60,40 95,50 60,60 50,95 40,60 5,50 40,40" fill="url(#geodeGrad)" opacity="0.08" />
    <polygon points="50,5 60,40 95,50 60,60 50,95 40,60 5,50 40,40" stroke="url(#geodeStroke)" strokeWidth="0.5" opacity="0.2" />
    <line x1="50" y1="5" x2="50" y2="95" stroke="url(#geodeStroke)" strokeWidth="0.3" opacity="0.12" />
    <line x1="5" y1="50" x2="95" y2="50" stroke="url(#geodeStroke)" strokeWidth="0.3" opacity="0.12" />
    <defs>
      <linearGradient id="geodeGrad" x1="50" y1="5" x2="50" y2="95">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#78350f" />
      </linearGradient>
      <linearGradient id="geodeStroke" x1="5" y1="50" x2="95" y2="50">
        <stop offset="0%" stopColor="#fcd34d" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
    </defs>
  </svg>
);

/* ─── Floating crystal animation data ─── */
const floatingCrystals = [
  { Component: CrystalShard, top: '8%', left: '5%', size: 'w-16 h-24', rotate: -15, delay: 0 },
  { Component: CrystalShard, top: '70%', left: '8%', size: 'w-12 h-20', rotate: 25, delay: 1.8 },
  { Component: CrystalCluster, top: '15%', right: '3%', size: 'w-32 h-28', rotate: 10, delay: 0.5 },
  { Component: GeodeCross, top: '60%', right: '6%', size: 'w-20 h-20', rotate: 45, delay: 2.5 },
  { Component: CrystalShard, bottom: '12%', left: '15%', size: 'w-10 h-16', rotate: -30, delay: 3 },
  { Component: GeodeCross, top: '35%', left: '3%', size: 'w-14 h-14', rotate: 20, delay: 1.2 },
  { Component: CrystalShard, bottom: '25%', right: '12%', size: 'w-14 h-22', rotate: -10, delay: 2 },
];

/* ─── Main Login Component ─── */

const LoginMain = ({ onLoginSuccess, onClose }) => {
  const { login: contextLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [focused, setFocused] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const { data } = await api.post('/api/login', credentials);
      return data;
    },
    onSuccess: (data) => {
      // if (data.token) localStorage.setItem('token', data.token); // Context's login() handles this
      toast.success('✅ Login successful!');

      const user = data.user;
      if (user && !user.uid && user.id) user.uid = user.id;

      // Update context immediately
      contextLogin(user, data.token);

      setTimeout(() => {
        if (data.role === 'admin' || (user && user.role === 'admin')) {
          window.location.href = '/admin-a9xK72rQ1m8vZpL0';
        } else {
          if (onClose) onClose();
          if (onLoginSuccess) {
            onLoginSuccess(user);
          }
          navigate('/');
        }
      }, 1000);
    },
    onError: (error) => {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Invalid email or password.';
      toast.error(message);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  return (
    <section
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
      onClick={(e) => { if (e.target === e.currentTarget && onClose) onClose(); }}
    >

      {/* ─── Deep Background ─── */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-amber-950/40 z-0" />

      {/* ─── Ambient Glow Orbs ─── */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-500/8 rounded-full blur-[180px] z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-600/6 rounded-full blur-[150px] z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-400/5 rounded-full blur-[200px] z-0 animate-pulse" />

      {/* ─── Noise Texture Overlay ─── */}
      <div
        className="absolute inset-0 opacity-[0.025] z-[1] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />

      {/* ─── Floating Crystal SVGs ─── */}
      <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
        {floatingCrystals.map((crystal, i) => {
          const { Component, size, rotate, delay, ...pos } = crystal;
          return (
            <motion.div
              key={i}
              className={`absolute ${size}`}
              style={{ ...pos, rotate: `${rotate}deg` }}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0.3, 0.7, 0.3],
                y: [0, -20, 0],
                rotate: [rotate, rotate + 8, rotate],
              }}
              transition={{
                duration: 10 + i * 1.5,
                repeat: Infinity,
                delay,
                ease: 'easeInOut',
              }}
            >
              <Component className="w-full h-full" />
            </motion.div>
          );
        })}
      </div>

      {/* ─── Main Login Card ─── */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-5xl mx-4 flex rounded-3xl overflow-hidden shadow-2xl shadow-black/40"
        style={{ backdropFilter: 'blur(40px)' }}
      >

        {/* ─── Close Button ─── */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/[0.06] border border-white/[0.1] text-zinc-400 hover:text-white hover:bg-white/[0.12] transition-all duration-200"
          >
            <X size={18} />
          </button>
        )}

        {/* ─── Left: Form Side ─── */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 bg-white/[0.04] border border-white/[0.08] md:rounded-l-3xl md:border-r-0 rounded-3xl md:rounded-r-none">

          {/* Brand Mark */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex items-center gap-3 mb-10"
          >
            <div className="p-2.5 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-xl border border-amber-500/20">
              <Gem className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm tracking-wider uppercase">Crystal Stones</h3>
              <p className="text-amber-500/70 text-[10px] font-semibold tracking-[0.3em] uppercase">Mart</p>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Welcome back
            </h2>
            <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
              Sign in to access your premium crystal collection
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="space-y-5"
          >
            {/* Email Input */}
            <div className="relative group">
              <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focused === 'email' ? 'text-amber-400' : 'text-zinc-500'}`}>
                <Mail size={18} />
              </div>
              <input
                className="w-full pl-12 pr-4 py-4 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-zinc-500 outline-none transition-all duration-300 focus:border-amber-500/40 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(245,158,11,0.08)]"
                type="email"
                name="email"
                placeholder="Email address"
                autoComplete="username"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused('')}
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative group">
              <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focused === 'password' ? 'text-amber-400' : 'text-zinc-500'}`}>
                <Lock size={18} />
              </div>
              <input
                className="w-full pl-12 pr-12 py-4 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-zinc-500 outline-none transition-all duration-300 focus:border-amber-500/40 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(245,158,11,0.08)]"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused('')}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-amber-400 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loginMutation.isPending}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl text-white font-bold text-sm uppercase tracking-widest shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12" />
              <span className="relative">
                {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
              </span>
              {!loginMutation.isPending && (
                <ArrowRight size={16} className="relative group-hover:translate-x-1 transition-transform" />
              )}
            </motion.button>
          </motion.form>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex items-center gap-4 my-7"
          >
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/10" />
            <span className="text-zinc-500 text-xs font-medium uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/10" />
          </motion.div>

          {/* Google Sign In */}
          <motion.a
            href={`${import.meta.env.VITE_API_URL}/api/google`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <button className="w-full py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-zinc-300 text-sm font-medium flex items-center justify-center gap-3 hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300 group">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
              </svg>
              <span className="group-hover:text-white transition-colors">Continue with Google</span>
            </button>
          </motion.a>

          {/* Register Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="mt-8 flex items-center justify-center gap-2"
          >
            <span className="text-zinc-500 text-sm">Don't have an account?</span>
            <Link to="/SignUpPage" onClick={() => onClose?.()}>
              <span className="text-amber-400 text-sm font-bold hover:text-amber-300 transition-colors cursor-pointer">
                Create one
              </span>
            </Link>
          </motion.div>
        </div>

        {/* ─── Right: Visual Side ─── */}
        <div className="hidden md:flex w-1/2 relative bg-gradient-to-br from-amber-950/40 via-zinc-900 to-zinc-950 items-center justify-center overflow-hidden border border-white/[0.05] rounded-r-3xl border-l-0">

          {/* Large crystal cluster background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <CrystalCluster className="w-[400px] h-[360px]" />
          </div>

          {/* Radial glows */}
          <div className="absolute top-1/3 left-1/3 w-48 h-48 bg-amber-500/15 rounded-full blur-[80px]" />
          <div className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-amber-400/10 rounded-full blur-[60px]" />

          {/* Center Content */}
          <div className="relative z-10 text-center px-10 space-y-8">
            {/* Crystal Icon */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="mx-auto"
            >
              <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/5 border border-amber-500/20 flex items-center justify-center backdrop-blur-sm shadow-2xl shadow-amber-500/10">
                <Gem className="w-12 h-12 text-amber-400" />
              </div>
            </motion.div>

            <div className="space-y-3">
              <h3 className="text-2xl font-black text-white tracking-tight">
                Authentic Crystals
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-xs mx-auto">
                Direct from Khambhat, India — hand-carved healing crystals and premium Akik stones since 1992.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-6">
              {[
                { label: '100% Genuine', icon: '◆' },
                { label: 'Since 1992', icon: '◆' },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  <span className="text-amber-500 text-[6px]">{badge.icon}</span>
                  {badge.label}
                </div>
              ))}
            </div>

            {/* Decorative line */}
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent mx-auto" />
          </div>

          {/* Corner Crystal Accents */}
          <div className="absolute top-6 right-6 opacity-30">
            <GeodeCross className="w-12 h-12" style={{ transform: 'rotate(15deg)' }} />
          </div>
          <div className="absolute bottom-8 left-8 opacity-20">
            <CrystalShard className="w-10 h-16" style={{ transform: 'rotate(-20deg)' }} />
          </div>
        </div>

      </motion.div>
    </section>
  );
};

export default LoginMain;