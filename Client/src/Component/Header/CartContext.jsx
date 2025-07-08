import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  // Function to update cart from anywhere in the app
  const updateCart = async (userId) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/cartedItem`, {
        uid: userId
      }, {
        withCredentials: true
      });
      setCartItems(res.data);
      setCartCount(res.data.length);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  return (
    <CartContext.Provider value={{ cartCount, cartItems, updateCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);