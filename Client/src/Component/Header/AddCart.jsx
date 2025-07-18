import React, { useEffect, useState , useRef } from 'react';
import toast from 'react-hot-toast';

// ...imports remain the same

function AddCart({ show, onClose, cartItems = [], user }) {
  const [showInDollar, setShowInDollar] = useState(true);
  const [localCart, setLocalCart] = useState([]);
  const intervalMap = useRef({});
const [showAddressModal, setShowAddressModal] = useState(false);
const [address, setAddress] = useState({
  street: user?.address?.street || "",
  city: user?.address?.city || "",
  state: user?.address?.state || "",
  postalCode: user?.address?.postalCode || "",
  country: user?.address?.country || "",
});


  useEffect(() => {
    const updatedCart = cartItems.map((item) => {
      const minQty = item.productId?.MinQuantity || 1;
      return {
        ...item,
        quantity: Math.max(item.quantity || 1, minQty),
      };
    });

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

    if (intervalMap.current[id]) clearInterval(intervalMap.current[id]);

    intervalMap.current[id] = setInterval(() => {
      updateQuantity(id, action);
    }, 150);
  };

  const stopQuantityChange = (id) => {
    if (intervalMap.current[id]) {
      clearInterval(intervalMap.current[id]);
      delete intervalMap.current[id];
    }
  };

  useEffect(() => {
    return () => {
      Object.values(intervalMap.current).forEach(clearInterval);
    };
  }, []);

  const handleDelete = async (item) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/deleteCart`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartId: item._id,
          uid: item.uid,
          productId: item.productId?._id,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setLocalCart((prev) => prev.filter((i) => i._id !== item._id));
      } else {
        toast.error('Failed to delete item');
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('Something went wrong while deleting');
    }
  };

  const total = localCart.reduce((acc, item) => {
    const price = item.price || 0; // ✅ Use saved price
    return acc + price * item.quantity;
  }, 0);

const handleInquiry = () => {
  if (!user?.uid) {
    toast.error("User ID not found. Please log in.");
    return;
  }
  setShowAddressModal(true);
};

// Helper function
const isAddressComplete = () =>
  ["street", "city", "state", "postalCode", "country"].every(
    (field) => address[field]?.trim()
  );

const submitInquiryWithAddress = async () => {
  if (!isAddressComplete()) {
    toast.error("Please fill all address fields.");
    return;
  }

  const uid = user.uid;
  const inquiryData = {
    uid,
    contactPhone: localCart[0]?.userMobile || "",
    message: "Inquiry from cart",
    address: {
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
    },
    products: localCart.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
      selectedSize: item.selectedSize || null,
      price: item.price || 0,
    })),
  };

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/submitInquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiryData),
    });

    const data = await res.json();

    if (res.ok) {
      await fetch(`${import.meta.env.VITE_API_URL}/api/clearCart`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid }),
      });

      setLocalCart([]);
      setShowAddressModal(false);
      toast.success("Inquiry submitted and cart cleared!");
      onClose();
    } else {
      toast.error(data.message || "Failed to submit inquiry");
    }
  } catch (err) {
    toast.error("Something went wrong while sending inquiry");
  }
};


  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          show ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-500 transform transition-transform duration-300 ease-in-out ${
          show ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold">Your Cart</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4">
            {localCart.length === 0 ? (
              <p className="text-center text-gray-500 mt-4">Your cart is empty.</p>
            ) : (
              localCart.map((item) => {
                const price = item.price ||item.productId?.dollarPrice;
                const minQty = item.productId?.MinQuantity || 1;

                return (
                  <div key={item._id} className="flex gap-3 border-b py-3 items-center">
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

                      {item.selectedSize && (
                        <p className="text-xs text-gray-600 mt-1">
                          Size: <span className="font-medium">{item.selectedSize}</span>
                        </p>
                      )}

                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onMouseDown={() => startQuantityChange(item._id, 'decrease')}
                          onMouseUp={() => stopQuantityChange(item._id)}
                          onMouseLeave={() => stopQuantityChange(item._id)}
                          onTouchStart={() => startQuantityChange(item._id, 'decrease')}
                          onTouchEnd={() => stopQuantityChange(item._id)}
                          disabled={item.quantity <= minQty}
                        >
                          -
                        </button>
                        <span className="text-sm">{item.quantity}</span>
                        <button
                          onMouseDown={() => startQuantityChange(item._id, 'increase')}
                          onMouseUp={() => stopQuantityChange(item._id)}
                          onMouseLeave={() => stopQuantityChange(item._id)}
                          onTouchStart={() => startQuantityChange(item._id, 'increase')}
                          onTouchEnd={() => stopQuantityChange(item._id)}
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
                        <p className="text-xs text-gray-400">Minimum {minQty} pcs required</p>
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
              <span>{showInDollar ? `$${total.toFixed(2)}` : `₹${total.toFixed(0)}`}</span>
            </div>
            <button
              onClick={handleInquiry}
              className="w-full py-2 px-4 rounded font-semibold bg-[#fff8a8] text-black hover:!text-white hover:!bg-black transition-all duration-300"
            >
              Make Inquiry for Order
            </button>
          </div>
        </div>
      </div>
   {showAddressModal && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <h2 className="text-lg font-semibold mb-3">Shipping Address</h2>

      {isAddressComplete() && !address.editing ? (
        <>
          <div className="text-sm space-y-1 mb-4">
            <p><strong>Street:</strong> {address.street}</p>
            <p><strong>City:</strong> {address.city}</p>
            <p><strong>State:</strong> {address.state}</p>
            <p><strong>Postal Code:</strong> {address.postalCode}</p>
            <p><strong>Country:</strong> {address.country}</p>
          </div>
          <div className="flex justify-between mt-4 gap-2">
            <button
              onClick={() => setAddress((prev) => ({ ...prev, editing: true }))}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Modify
            </button>
            <button
              onClick={submitInquiryWithAddress}
              className="px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              Confirm & Submit
            </button>
          </div>
        </>
      ) : (
        <>
          <input
            type="text"
            className="w-full border rounded p-2 mt-2"
            placeholder="Street Address"
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
          />
          <input
            type="text"
            className="w-full border rounded p-2 mt-2"
            placeholder="City"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
          />
          <input
            type="text"
            className="w-full border rounded p-2 mt-2"
            placeholder="State"
            value={address.state}
            onChange={(e) => setAddress({ ...address, state: e.target.value })}
          />
          <input
            type="text"
            className="w-full border rounded p-2 mt-2"
            placeholder="Postal Code"
            value={address.postalCode}
            onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
          />
          <input
            type="text"
            className="w-full border rounded p-2 mt-2"
            placeholder="Country"
            value={address.country}
            onChange={(e) => setAddress({ ...address, country: e.target.value })}
          />
          <div className="flex justify-end mt-4 gap-2">
            <button
              onClick={() => {
                setShowAddressModal(false);
                setAddress((prev) => ({ ...prev, editing: false }));
              }}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={submitInquiryWithAddress}
              className="px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              Confirm & Submit
            </button>
          </div>
        </>
      )}
    </div>
  </div>
)}

</>
  );
}

export default AddCart;



