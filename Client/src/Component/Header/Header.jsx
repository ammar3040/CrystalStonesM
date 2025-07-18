import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGem } from '@fortawesome/free-solid-svg-icons';
import "./header.css";
import AddCart from './AddCart';
import MobileNavbar from './MobileNavbar';
import LoginMain from '../Form/LoginMain';
import SignUpMain from '../Form/SignUpMain';
import { Link,  useNavigate } from 'react-router-dom';
import { MdEmail,MdPhoneAndroid } from 'react-icons/md';
import { MdLocationOn } from 'react-icons/md';
import axios from 'axios';
import { FaBoxOpen, FaClipboardList } from 'react-icons/fa';
import Inquiry from './Inquiry';





function Header({ onCartClick }) {
  const [catagorys, setCatagorys] = useState([]);
  const [placeholder, setPlaceholder] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null); // to hold cookie user

  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
const [inquiryOpen, setInquiryOpen] = useState(false);

  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const fullPlaceholder = "Search for products...";
  const typingSpeed = 150;
  const deletingSpeed = 50;
  const pauseDuration = 2000;
  const [cartItems, setCartItems] = useState([]);

 
  const [cartOpen, setCartOpen] = useState(false);

  const [allProducts, setAllProducts] = useState([]);
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
  const getUserFromCookie = () => {
    const cookieString = document.cookie;
    const cookies = cookieString.split('; ');
    const userCookie = cookies.find(cookie => cookie.startsWith('user='));

    if (userCookie) {
      try {
        const cookieValue = decodeURIComponent(userCookie.split('=')[1]);

        // Check if it's valid
        if (cookieValue === 'undefined') {
          setUser(null);
        } else {
          const parsedUser = JSON.parse(cookieValue);
          setUser(parsedUser);
            fetchCartItems(parsedUser.uid); // 👈 Fetch with Axios
        }
      } catch (error) {
        console.error('Error parsing user cookie:', error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  getUserFromCookie();
},[isProfileOpen, isLoginOpen]);
useEffect(() => {
  if (user) {
    setIsProfileOpen(true);
    setIsLoginOpen(false);
  } else {
    setIsProfileOpen(false);
    setIsLoginOpen(true);
  }
}, []);


  const handleLogout = () => {
    // Clear cookies
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setUser(null);
    setIsProfileOpen(false);
    // Optional: redirect to home or login page
    navigate('/');
  };

  // handle seach input change

  const handleSearchChange = (query) => {
  setSearchQuery(query);

  if (!query.trim()) {
    setSearchResults([]);
    return;
  }

  const filtered = allProducts.filter(product =>
    product.productName.toLowerCase().includes(query.toLowerCase())
  );
  setSearchResults(filtered.slice(0, 5)); // limit to 5 suggestions
};



  

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

  useEffect(() => {
  const fetchAllProducts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/all`);
      const data = await response.json();
      setAllProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  fetchAllProducts();
}, []);

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
      <nav className="bg-white shadow-sm sticky top-0 transition-all duration-300 z-50">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 flex ">
           {/* Logo */}
           <div className="flex-shrink-0 flex items-center" style={{ minWidth: "150px", maxWidth: "200px" }}>
  <Link to="/" className="flex items-center h-full">
    <img 
      src= 'https://res.cloudinary.com/dioicxwct/image/upload/v1751975090/fullLogo_tgcxoq.png'
      alt="Company Logo" 
      className=" object-contain "
      style={{width:"150px"}} // Ensures proportional scaling
    />
  </Link>
</div>

            <div className='lex-1 w-full sm:w-auto mt-2 sm:mt-0' style={{width:"87%"}} >
          {/* First Row - Logo, Search, Icons */}
          <div className="flex justify-between items-center h-16  transition-all duration-300" style={{}}>
           

            {/* Animated Search */}
            <div className="flex-grow flex justify-center px-4">
              <div className="relative w-full max-w-md">
               <input
  placeholder={placeholder}
  id="input"
  value={searchQuery}
  onChange={(e) => handleSearchChange(e.target.value)}
  onFocus={() => setShowSuggestions(true)}
  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
  name="text"
  type="text"
/>
{showSuggestions && searchResults.length > 0 && (
   <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">

    {searchResults.map(product => (
  <a
    key={product._id}
    href={`/product/${product._id}`}
    className="flex items-center px-4 py-2 hover:bg-yellow-50 transition-all"
  >
    <img
      src={product.mainImage.url} // make sure this is your correct image field
      alt={product.productName}
      className="w-10 h-10 object-cover rounded mr-3 border"
    />
    <span className="text-sm text-gray-700">{product.productName}</span>
  </a>
))}


  </div>
)}


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
            <div className="md:flex hidden items-center space-x-4">
            <div className="flex items-center space-x-4">
              {/* inqur6 icon */}

              <div className="relative">
  <button
    onClick={() => {
      if (!user) {
        setIsLoginOpen(true);
        setIsProfileOpen(true);
      } else {
        setInquiryOpen(true); // 👈 Open inquiry panel
      }
    }}
    className="text-gray-500 hover:text-yellow-600 focus:outline-none"
  >
    <FaBoxOpen className="h-5 w-5" />
  </button>
</div>

              {/* Cart button */}
           <div className="relative">
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
    className="text-gray-500 hover:text-yellow-600 focus:outline-none"
  >
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  
  </button>

  {cartItems.length > 0 && (
    <span className="absolute -top-2 -right-2 bg-[#fff8a8]  text-xs font-bold px-1.5 py-0.5 rounded-full">
      {cartItems.length}
    </span>
  )}
</div>


              <button className="text-gray-500 hover:text-yellow-600 focus:outline-none" 
                onClick={() => setIsProfileOpen(true)}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              </div>
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
           {           catagorys.map((catagory) => (
                    <a 
                      key={catagory._id } 
                     href={`/catagory/${encodeURIComponent(catagory.category)}`}

                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700"
                    >
                      {catagory.category}
                    </a>
                  ))}
                  </div>
                )}
              </div>
              <Link to={"/ViewAllProduct"}>
              <p  className="text-gray-700 hover:text-yellow-600 px-1 text-sm font-medium uppercase tracking-wider transition-colors">
                Collections
              </p>
              </Link>
              <a href="/#contactForm" className="text-gray-700 hover:text-yellow-600 px-1 text-sm font-medium uppercase tracking-wider transition-colors">
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
      
      <AddCart show={cartOpen} onClose={() => setCartOpen(false)} cartItems={cartItems} user={user}/>
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
               
  {/* ✅ NEW: Complete Profile Button */}
  {(!user.address || !user.mobile || !user.password) && (
    <button
      onClick={() => {
        setIsProfileOpen(false);
        navigate("/CompleteProfile");
      }}
      className="w-full mt-2 flex justify-center items-center px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md"
    >
      Complete Profile
    </button>
  )}

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
    if (userData.role === 'admin') {
      window.location.href = `${import.meta.env.VITE_API_URL}/admin`;
    }
  }}
  onClose={() => {setIsProfileOpen(false);
  
  setIsLoginOpen(false)}} 
/>

           
          
         
        )}


  </div>
)}
{user && (
  <Inquiry show={inquiryOpen} onClose={() => setInquiryOpen(false)} user={user} />
)}

    </>
    
)
}

export default Header;