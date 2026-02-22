import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGem } from '@fortawesome/free-solid-svg-icons';
import "./header.css";
import AddCart from './AddCart';
import MobileNavbar from './MobileNavbar';
import LoginMain from '../Form/LoginMain';
import SignUpMain from '../Form/SignUpMain';
import { Link, useNavigate } from 'react-router-dom';
import { MdEmail, MdPhoneAndroid } from 'react-icons/md';
import { MdLocationOn } from 'react-icons/md';
import axios from 'axios';
import { FaBoxOpen, FaClipboardList } from 'react-icons/fa';
import Inquiry from './Inquiry';
import { useAuth } from '../../context/AuthContext';





function Header({ onCartClick }) {
  const { user, setUser, logout } = useAuth();
  const [catagorys, setCatagorys] = useState([]);
  const [placeholder, setPlaceholder] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  // const [user, setUser] = useState(null); // to hold cookie user

  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [isShopOpen, setIsShopOpen] = useState(false);

  // Scroll-aware header: hide on scroll down, show on scroll up
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY <= 10) {
        setHeaderVisible(true); // Always show at top
      } else if (currentY > lastScrollY.current && currentY > 80) {
        setHeaderVisible(false); // Scrolling DOWN → hide
      } else {
        setHeaderVisible(true); // Scrolling UP → show
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const fullPlaceholder = "Search for products...";
  const typingSpeed = 150;
  const deletingSpeed = 50;
  const pauseDuration = 2000;
  const [cartItems, setCartItems] = useState([]);


  const [cartOpen, setCartOpen] = useState(false);


  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);



  // Typing animation
  useEffect(() => {
    let timeout;

    if (placeholderIndex < fullPlaceholder.length) {
      timeout = setTimeout(() => {
        setPlaceholder(fullPlaceholder.substring(0, placeholderIndex + 1));
        setPlaceholderIndex(placeholderIndex + 1);
      }, typingSpeed);
    } else if (placeholderIndex === fullPlaceholder.length) {
      timeout = setTimeout(() => {
        setPlaceholderIndex(placeholderIndex + 1);
      }, pauseDuration);
    } else if (placeholderIndex > fullPlaceholder.length && placeholder.length > 0) {
      timeout = setTimeout(() => {
        setPlaceholder(fullPlaceholder.substring(0, placeholder.length - 1));
      }, deletingSpeed);
    } else {
      setPlaceholderIndex(0);
    }

    return () => clearTimeout(timeout);
  }, [placeholder, placeholderIndex]);
  useEffect(() => {
    if (user) {
      setIsProfileOpen(true);
      setIsLoginOpen(false);
    } else {
      setIsProfileOpen(false);
      setIsLoginOpen(true);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  // handle seach input change

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/ViewAllProduct?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/all?search=${encodeURIComponent(searchQuery)}&limit=5`);
        const data = await response.json();
        setSearchResults(data.products || []);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchSearchResults();
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);





  useEffect(() => {
    const fetchCatagorys = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/getCatagory`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setCatagorys(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCatagorys(); // <-- make sure to call it
  }, []);


  // for search api


  // Fetch cart items when user is set
  const fetchCartItems = async (uid) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/cartedItem`, {
        uid: uid
      }, {
        withCredentials: true
      });

      setCartItems(res.data); // assuming your API returns the cart array directly
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };



  return (
    <>
      <nav className={`bg-white shadow-sm sticky top-0 transition-all duration-300 z-50 border-b border-gray-100 ${headerVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 flex ">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center min-w-[140px] sm:min-w-[180px] max-w-[200px] sm:max-w-[240px]">
            <Link to="/" className="flex items-center h-full py-2">
              <img
                src='https://res.cloudinary.com/dioicxwct/image/upload/v1771661574/crystal_stones_mart_logo-removebg-preview_f5fkqc_c_crop_ar_16_9_sbzdm9.png'
                alt="Company Logo"
                className="object-contain w-[140px] sm:w-[200px]"
              />
            </Link>
          </div>

          <div className='flex-1 w-full sm:w-auto mt-2 sm:mt-0'>
            {/* First Row - Logo, Search, Icons */}
            <div className="flex justify-between items-center h-16  transition-all duration-300" style={{}}>


              {/* Animated Search */}
              <div className="flex-grow flex justify-center px-2 sm:px-4">
                <div className="relative w-full max-w-md">
                  <input
                    placeholder={placeholder}
                    id="input"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="w-full pl-10 pr-4 py-2 border border-amber-200/40 rounded-full bg-white/60 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-300 placeholder-gray-400 transition-all"
                    name="text"
                    type="text"
                  />
                  {showSuggestions && searchResults.length > 0 && (
                    <div className="absolute z-50 left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border border-amber-100 rounded-2xl shadow-2xl max-h-80 overflow-y-auto">

                      {searchResults.map(product => (
                        <a
                          key={product._id}
                          href={`/product/${product._id}`}
                          className="flex items-center px-4 py-3 hover:bg-amber-50 transition-all border-b border-amber-50 last:border-0"
                        >
                          <img
                            src={product.mainImage.url} // make sure this is your correct image field
                            alt={product.productName}
                            className="w-12 h-12 object-cover rounded-lg mr-4 border border-amber-100 shadow-sm"
                          />
                          <span className="text-sm font-medium text-gray-700">{product.productName}</span>
                        </a>
                      ))}


                    </div>
                  )}


                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-amber-500/50" viewBox="0 0 512 512">
                      <path
                        fill="currentColor"
                        d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Icons */}
              <div className="md:flex hidden items-center space-x-6">
                <div className="flex items-center space-x-6">
                  {/* inqur6 icon */}

                  <div className="relative group">
                    <button
                      onClick={() => {
                        if (!user) {
                          setIsLoginOpen(true);
                          setIsProfileOpen(true);
                        } else {
                          setInquiryOpen(true); // 👈 Open inquiry panel
                        }
                      }}
                      className="text-amber-800/60 hover:text-amber-600 focus:outline-none transition-all hover:scale-110"
                    >
                      <FaBoxOpen className="h-5 w-5" />
                    </button>
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">My Inquiries</span>
                  </div>

                  {/* Cart button */}
                  <div className="relative group">
                    <button
                      onClick={() => {
                        if (!user) {
                          setIsLoginOpen(true);
                          setIsProfileOpen(true);
                        } else {
                          fetchCartItems(user.uid); // refresh cart
                          setCartOpen(true);
                        }
                      }}
                      className="text-amber-800/60 hover:text-amber-600 focus:outline-none transition-all hover:scale-110"
                    >
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>

                    </button>

                    {cartItems.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full shadow-lg">
                        {cartItems.length}
                      </span>
                    )}
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Your Cart</span>
                  </div>


                  <button className="text-amber-800/60 hover:text-amber-600 focus:outline-none transition-all hover:scale-110"
                    onClick={() => setIsProfileOpen(true)}
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Second Row - Desktop Navigation */}
            <div className="hidden md:flex justify-center items-center h-12 border-t border-amber-200/10">
              <div className="flex space-x-12 items-center h-full">
                <a href="/" className="flex items-center h-full text-gray-700 hover:text-amber-600 text-xs font-bold uppercase tracking-[0.2em] transition-all hover:scale-110">
                  Home
                </a>

                {/* Shop Dropdown */}
                <div className="relative"
                  onMouseEnter={() => setIsShopOpen(true)}
                  onMouseLeave={() => setIsShopOpen(false)}
                >
                  <button
                    className="text-gray-700 hover:text-amber-600 text-sm font-bold uppercase tracking-[0.2em] transition-all flex items-center h-full gap-1 hover:scale-110"
                    onClick={() => setIsShopOpen(!isShopOpen)}
                  >
                    SHOP
                    <svg
                      className={`h-3 w-3 transition-transform duration-300 transform ${isShopOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu - Refined Glassmorphism & State Based Rendering */}
                  {isShopOpen && (
                    <div className="absolute left-1/2 -translate-x-1/2 mt-0 pt-4 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="w-[450px] bg-white/95 backdrop-blur-2xl rounded-[2rem] shadow-[0_30px_80px_-15px_rgba(0,0,0,0.15)] border border-amber-100 overflow-hidden">
                        <div className="p-8 grid grid-cols-2 gap-x-8 gap-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                          {catagorys.length > 0 ? (
                            catagorys.map((catagory) => (
                              <a
                                key={catagory._id}
                                href={`/catagory/${encodeURIComponent(catagory.category)}`}
                                className="group/item flex items-center gap-3 py-2 text-xs font-bold text-gray-500 hover:text-amber-600 transition-all border-b border-transparent hover:border-amber-100"
                              >
                                <span className="w-1 h-1 rounded-full bg-amber-300 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                {catagory.category}
                              </a>
                            ))
                          ) : (
                            <div className="col-span-2 text-center py-4 text-gray-400 text-[10px] font-bold uppercase tracking-widest italic">
                              Discovering Collections...
                            </div>
                          )}
                        </div>
                        <div className="bg-amber-50/50 p-4 text-center">
                          <Link to="/ViewAllProduct" className="text-[10px] font-black uppercase tracking-widest text-amber-600 hover:text-amber-700 transition-colors flex items-center justify-center gap-2">
                            View All Collections <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Link to={"/ViewAllProduct"} className="flex items-center h-full">
                  <span className="text-gray-700 hover:text-amber-600 text-xs font-bold uppercase tracking-[0.2em] transition-all hover:scale-110">
                    Collections
                  </span>
                </Link>
                <a href="/#contactForm" className="flex items-center h-full text-gray-700 hover:text-amber-600 text-xs font-bold uppercase tracking-[0.2em] transition-all hover:scale-110">
                  About
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation (shown only on mobile) */}
      <div className="md:hidden">
        <MobileNavbar catagory={catagorys} MobilecartItems={cartItems} Mobileuser={user} />
      </div>

      <AddCart show={cartOpen} onClose={() => setCartOpen(false)} cartItems={cartItems} user={user} />
      {
        isProfileOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div
              className="fixed inset-0 bg-opacity-30 backdrop-blur-sm transition-opacity"
              onClick={() => setIsProfileOpen(false)}
            ></div>
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-black"
              onClick={() => setIsProfileOpen(false)}
            >
              ✕
            </button>
            {user ? (
              <div className="flex items-center justify-center min-h-screen p-4">
                <div className="relative w-full max-w-xs rounded-2xl overflow-hidden shadow-2xl shadow-black/50" style={{ backdropFilter: 'blur(40px)' }}>
                  {/* Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-900 to-amber-950/30 z-0" />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[60px] z-0" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-600/8 rounded-full blur-[50px] z-0" />

                  {/* Close Button */}
                  <button
                    onClick={() => setIsProfileOpen(false)}
                    className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-zinc-400 hover:text-white hover:bg-white/[0.12] transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>

                  <div className="relative z-10 p-6 border border-white/[0.08] rounded-2xl">
                    <div className="flex flex-col items-center">
                      {/* Avatar */}
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/20 flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>

                      <h3 className="text-lg font-bold text-white">{user.name}</h3>

                      <div className="mt-2 space-y-1 text-center">
                        <p className="text-xs text-zinc-400 flex items-center gap-1.5">
                          <MdEmail className="text-amber-500" /> {user.email}
                        </p>
                        <p className="text-xs text-zinc-400 flex items-center gap-1.5">
                          <MdLocationOn className="text-amber-500" /> {user.address || 'Not set'}
                        </p>
                        {user.mobile && (
                          <p className="text-xs text-zinc-400 flex items-center gap-1.5">
                            <MdPhoneAndroid className="text-amber-500" /> {user.mobile}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-white/[0.08] space-y-2">
                      <button
                        onClick={() => { setIsProfileOpen(false); navigate("/"); }}
                        className="w-full py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-amber-400 text-xs font-bold uppercase tracking-widest hover:bg-white/[0.08] transition-all duration-200"
                      >
                        View Products
                      </button>

                      {(!user.address || !user.mobile || !user.password) && (
                        <button
                          onClick={() => { setIsProfileOpen(false); navigate("/CompleteProfile"); }}
                          className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl text-white text-xs font-bold uppercase tracking-widest shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-200"
                        >
                          Complete Profile
                        </button>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full py-2.5 bg-white/[0.04] border border-red-500/20 rounded-xl text-red-400 text-xs font-bold uppercase tracking-widest hover:bg-red-500/10 transition-all duration-200"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <LoginMain
                onLoginSuccess={(userData) => {
                  setUser(userData);
                  if (userData.role === 'admin') {
                    window.location.href = `${import.meta.env.VITE_API_URL}/admin`;
                  }
                }}
                onClose={() => {
                  setIsProfileOpen(false);

                  setIsLoginOpen(false)
                }}
              />




            )}


          </div>
        )
      }
      {
        user && (
          <Inquiry show={inquiryOpen} onClose={() => setInquiryOpen(false)} user={user} />
        )
      }

    </>

  )
}

export default Header;