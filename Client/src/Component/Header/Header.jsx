import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGem } from '@fortawesome/free-solid-svg-icons';
import "./header.css";
import AddCart from './AddCart';
import MobileNavbar from './MobileNavbar';
import LoginMain from '../Form/LoginMain';
import SignUpMain from '../Form/SignUpMain';
import { useNavigate } from 'react-router-dom';
import { MdEmail,MdPhoneAndroid } from 'react-icons/md';
import { MdLocationOn } from 'react-icons/md';





function Header({ onCartClick }) {
  const [placeholder, setPlaceholder] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null); // to hold cookie user

  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const fullPlaceholder = "Search for products...";
  const typingSpeed = 150;
  const deletingSpeed = 50;
  const pauseDuration = 2000;
 
  const [cartOpen, setCartOpen] = useState(false);

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);
  
  useEffect( () => {
    if (user) {
      setIsProfileOpen(true); // Show profile modal if logged in
    } else {
      setIsLoginOpen(true); // Show login modal if logged out
    }
  
},[])

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
   const getUserFromCookie = () => {
  const cookieString = document.cookie;
  const cookies = cookieString.split('; ');
  const userCookie = cookies.find(cookie => cookie.startsWith('user='));
  
  if (userCookie) {
    const cookieValue = userCookie.split('=')[1];
    try {
      // First decode the URI component, then handle any unexpected prefixes
      const decodedValue = decodeURIComponent(cookieValue);
      
      // Handle cases where the value might start with "j:" or similar
      const jsonString = decodedValue.startsWith('j:') 
        ? decodedValue.substring(2) 
        : decodedValue;
      
      const userData = JSON.parse(jsonString);
      setUser(userData);
    } catch (error) {
      console.error('Error parsing user cookie:', error);
      // Try to manually extract data if parsing fails
      try {
        const manualMatch = decodedValue.match(/"name":"([^"]+)"/);
        if (manualMatch) {
          setUser({ name: manualMatch[1] });
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    }
  } else {
    setUser(null);
  }
};

    getUserFromCookie();
  }, [isProfileOpen]); // Re-check when modal opens


  const handleLogout = () => {
    // Clear cookies
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setUser(null);
    setIsProfileOpen(false);
    // Optional: redirect to home or login page
    navigate('/');
  };

  

  return (
    <>
      <nav className="bg-white shadow-sm sticky top-0 transition-all duration-300 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex ">
           {/* Logo */}
            <div className="flex " style={{height:"200%",width:"25%",}}>
              <a href="#" className="flex items-center">
                <img src={"/img/fullLogo.png"} alt="" className=" h-full" style={{
                  objectFit:"contain",
                 
                }}/>
              </a>
            </div>
            <div className='' style={{width:"75%",}}>
          {/* First Row - Logo, Search, Icons */}
          <div className="flex justify-between items-center h-16  transition-all duration-300" style={{}}>
           

            {/* Animated Search */}
            <div className="flex-grow flex justify-center px-4">
              <div className="relative w-full max-w-md">
                <input
                  placeholder={placeholder}
                  id="input"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  name="text"
                  type="text"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 512 512">
                    <path
                      fill="currentColor"
                      d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              {/* Cart button */}
              <button 
                onClick={() => setCartOpen(true)} 
                className="text-gray-500 hover:text-yellow-600 focus:outline-none"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </button>

              <button className="text-gray-500 hover:text-yellow-600 focus:outline-none" 
                onClick={() => setIsProfileOpen(true)}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            </div>
          </div>
{/* Profile Modal using DaisyUI */}
{/* Profile Modal */}

          {/* Second Row - Desktop Navigation */}
          <div className="hidden md:flex justify-center items-end  h-12 border-t border-gray-100">
            <div className="flex space-x-8">
              <a href="/" className="text-gray-700 hover:text-yellow-600 px-1 text-sm font-medium uppercase tracking-wider transition-colors">
                Home
              </a>
              
              {/* Shop Dropdown */}
              <div className="relative">
                <button 
                  className="text-gray-700 hover:text-yellow-600 px-1 text-sm font-medium uppercase tracking-wider transition-colors flex items-center"
                  onClick={() => setIsShopOpen(!isShopOpen)}
                  onMouseEnter={() => setIsShopOpen(true)}
                >
                  Shop
                  <svg 
                    className={`ml-1 h-4 w-4 transition-transform duration-200 transform ${isShopOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                {isShopOpen && (
                  <div 
                    className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100"
                    onMouseLeave={() => setIsShopOpen(false)} style={{height:"350px",overflowX:"scroll"}}>
           
<a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700">Angels</a>
<a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700">Arrowhead</a>
<a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700">Ball Sphere</a>
<a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700">Bowl</a>
<a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700">Bracelets</a>
<a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700">Chakra Products</a>
<a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700">Cabochons</a>
<a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700">Candle Holders</a>
<a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700">Energy Generating Tools</a>
<a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700">Gemstone Egg</a>
<a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700">Gemstone Beads</a>
<a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700">Geometric Platonic Solids</a>


<a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700">Gemstone Shivalingam</a>
<a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700">Gemstone Tree</a>
<a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700">Healing Stick</a>
<a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700">Heart</a>
<a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700">Idols Hand Carvings</a>
<a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700">Japa Mala</a>
<a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700">Massage Wands</a>
<a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700">Merkaba Star</a>
<a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700">Orgone Energy Products</a>
<a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700">Obelisk Tower</a>
<a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700">Pencil Points</a>
<a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700">Pendulums</a>
                  </div>
                )}
              </div>
              
              <a href="/" className="text-gray-700 hover:text-yellow-600 px-1 text-sm font-medium uppercase tracking-wider transition-colors">
                Collections
              </a>
              <a href="/" className="text-gray-700 hover:text-yellow-600 px-1 text-sm font-medium uppercase tracking-wider transition-colors">
                About
              </a>
            </div>
          </div>
        </div>
        </div>
      </nav>
      
      {/* Mobile Navigation (shown only on mobile) */}
      <div className="md:hidden">
        <MobileNavbar />
      </div>
      
      <AddCart show={cartOpen} onClose={() => setCartOpen(false)} />
{isProfileOpen && (
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
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-xs">
        
        
        
          <div className="p-6">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              
              <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
              
 

             <p className="text-sm text-gray-500 flex items-center gap-1">
  <MdEmail /> {user.email}
</p>

              <p className="text-sm text-gray-500 flex items-center gap-1">  <MdLocationOn />{user.address}</p>
              
              {user.mobile && (
                <p className="text-sm text-gray-500 flex items-center gap-1"><MdPhoneAndroid/>{user.mobile}</p>
              )}
            </div>
            
            <div className="mt-6 border-t border-gray-200 pt-4">
              <button
             onClick={()=>{setIsProfileOpen(false)
              navigate("/")}}
                className="w-full flex justify-center items-center px-4 py-2 text-sm font-medium text-yellow-600 hover:bg-yellow-50 rounded-md"
              >
                View product
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full mt-2 flex justify-center items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
              >
                Sign out
              </button>
            </div>
          </div>
     
      </div>
    </div>
       ) : (
          <LoginMain
           onLoginSuccess={(userData) => {
          setUser(userData);
          // Redirect logic for admins only
          if (userData.role === 'admin') {
            window.location.href = `${import.meta.env.VITE_API_URL}/admin`;
          }
        }}
        onClose={() => setIsProfileOpen(false)} 
          />
           
          
         
        )}


  </div>
)}
    </>
    
)
}

export default Header;