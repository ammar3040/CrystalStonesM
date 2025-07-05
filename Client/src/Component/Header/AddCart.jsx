import React, { useEffect, useState } from 'react';

function AddCart({ show, onClose, cartItems = [] }) {
  const [showInDollar, setShowInDollar] = useState(false);
  const [localCart, setLocalCart] = useState([]);
  const [intervalId, setIntervalId] = useState(null);

 useEffect(() => {
  const updatedCart = cartItems.map((item) => {
    const minQty = item.productId?.MinQuantity || 1;
    return {
      ...item,
      quantity: Math.max(item.quantity || 1, minQty),
    };
  });

  // prevent infinite update loop
  const isEqual = JSON.stringify(updatedCart) === JSON.stringify(localCart);
  if (!isEqual) setLocalCart(updatedCart);
}, [cartItems]);


  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (show) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [show, onClose]);

  const updateQuantity = (id, action) => {
    const updated = localCart.map((item) => {
      if (item._id === id) {
        const minQty = item.productId?.MinQuantity || 1;
        let newQty = item.quantity;

        if (action === 'increase') newQty += 1;
        else if (action === 'decrease') newQty = Math.max(minQty, newQty - 1);

        return { ...item, quantity: newQty };
      }
      return item;
    });
    setLocalCart(updated);
  };

  const startQuantityChange = (id, action) => {
    updateQuantity(id, action);
    const idInterval = setInterval(() => {
      updateQuantity(id, action);
    }, 150);
    setIntervalId(idInterval);
  };

  const stopQuantityChange = () => {
    clearInterval(intervalId);
    setIntervalId(null);
  };
  useEffect(() => {
  return () => {
    if (intervalId) clearInterval(intervalId);
  };
}, [intervalId]);

const handleDelete = async (item) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/deleteCart`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cartId: item._id,
        uid: item.uid,
        productId: item.productId?._id, // optional if you use only cartId + uid
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setLocalCart((prev) => prev.filter((i) => i._id !== item._id));
    } else {
      console.error('Failed to delete:', data.message);
      alert('Failed to delete item');
    }
  } catch (err) {
    console.error('Error:', err);
    alert('Something went wrong while deleting');
  }
};


  const total = localCart.reduce((acc, item) => {
    const price = showInDollar
      ? item.productId?.dollarPrice || 0
      : item.productId?.discountedPrice || 0;
    return acc + price * item.quantity;
  }, 0);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          show ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          show ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold">Your Cart</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex justify-end px-4 py-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showInDollar}
                onChange={() => setShowInDollar(!showInDollar)}
              />
              Show in Dollar
            </label>
          </div>

          <div className="flex-1 overflow-y-auto px-4">
            {localCart.length === 0 ? (
              <p className="text-center text-gray-500 mt-4">Your cart is empty.</p>
            ) : (
              localCart.map((item) => {
                const price = showInDollar
                  ? item.productId?.dollarPrice || 0
                  : item.productId?.discountedPrice || 0;
                const minQty = item.productId?.MinQuantity || 1;

                return (
                  <div
                    key={item._id}
                    className="flex gap-3 border-b py-3 items-center"
                  >
                    <img
                      src={item.productId?.mainImage?.url}
                      alt={item.productId?.productName || 'Product'}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-sm line-clamp-1">
                          {item.productId?.productName}
                        </h3>
                        <button
                          onClick={() => handleDelete(item)}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <button
                          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                          onMouseDown={() => startQuantityChange(item._id, 'decrease')}
                          onMouseUp={stopQuantityChange}
                          onMouseLeave={stopQuantityChange}
                          onTouchStart={() => startQuantityChange(item._id, 'decrease')}
                          onTouchEnd={stopQuantityChange}
                          disabled={item.quantity <= minQty}
                        >
                          -
                        </button>
                        <span className="text-sm">{item.quantity}</span>
                        <button
                          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                          onMouseDown={() => startQuantityChange(item._id, 'increase')}
                          onMouseUp={stopQuantityChange}
                          onMouseLeave={stopQuantityChange}
                          onTouchStart={() => startQuantityChange(item._id, 'increase')}
                          onTouchEnd={stopQuantityChange}
                        >
                          +
                        </button>
                      </div>

                      <p className="text-sm font-semibold mt-1">
                        {showInDollar
                          ? `$${(price * item.quantity).toFixed(2)}`
                          : `₹${(price * item.quantity).toFixed(0)}`}
                      </p>
                      {minQty > 1 && (
                        <p className="text-xs text-gray-400">
                          Minimum {minQty} pcs required
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-4 border-t">
            <div className="flex justify-between font-bold text-lg mb-3">
              <span>Total:</span>
              <span>
                {showInDollar
                  ? `$${total.toFixed(2)}`
                  : `₹${total.toFixed(0)}`}
              </span>
            </div>
            <button className="w-full py-2 px-4 rounded font-semibold bg-[#fff8a8] text-black hover:!text-white hover:!bg-black transition-all duration-300">
              Make Inquiry for Order
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddCart;
