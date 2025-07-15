import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

const SubscribeEmailModal = ({ forceOpen = false, onClose }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef(null);
  const modalRef = useRef(null);

  // Check subscription status more reliably
  const isSubscribed = () => {
    try {
      return document.cookie
        .split(';')
        .some(cookie => cookie.trim().startsWith('subscribed=true'));
    } catch (error) {
      console.error('Cookie check error:', error);
      return false;
    }
  };

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };

    if (showPopup) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPopup]);

  // Show/hide logic
  useEffect(() => {
    if (forceOpen) {
      setShowPopup(true);
      return;
    }

    if (!isSubscribed()) {
      timerRef.current = setTimeout(() => {
        setShowPopup(true);
      }, 7000); // 7 seconds delay
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
        document.cookie = 'subscribed=true; path=/; max-age=2592000'; // 30 days
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

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div 
        ref={modalRef}
        className="bg-white p-6 rounded-lg max-w-md w-full mx-4 relative shadow-xl"
      >
        <button 
          onClick={handleClose}
          className="absolute top-3 right-4 text-xl hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          &times;
        </button>

        <form onSubmit={handleSubmitEmail} className="text-center">
          <h3 className="text-xl font-bold mb-2">Stay Updated</h3>
          <p className="text-gray-600 mb-6">
            Subscribe to receive our latest offers and news
          </p>
          
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            } transition-colors`}
          >
            {isLoading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>

        <div className="mt-6">
          <a 
            href={`${import.meta.env.VITE_API_URL}/api/google`} 
            className="block"
          >
            <button className="w-full max-w-xs mx-auto flex items-center justify-center bg-white border border-gray-300 rounded-md py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path 
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" 
                  fill="#4285F4"
                />
                <path 
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" 
                  fill="#34A853"
                />
                <path 
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" 
                  fill="#FBBC05"
                />
                <path 
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" 
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SubscribeEmailModal;