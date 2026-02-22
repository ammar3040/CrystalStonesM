import React, { useEffect, useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../lib/api';

function AddCart({ show, onClose, cartItems = [], user }) {
  const [showInDollar, setShowInDollar] = useState(true);
  const [localCart, setLocalCart] = useState([]);
  const intervalMap = useRef({});
  const [showAddressModal, setShowAddressModal] = useState(false);
  const queryClient = useQueryClient();

  const [address, setAddress] = useState({
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    postalCode: user?.address?.postalCode || "",
    country: user?.address?.country || "",
  });

  // Mutation for updating cart quantity
  const updateCartMutation = useMutation({
    mutationFn: async ({ cartId, action }) => {
      const { data } = await api.put('updateCart', { cartId, action });
      return data;
    },
    onMutate: async ({ cartId, action }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['cart', user?.uid] });

      // Snapshot the previous value
      const previousCart = localCart;

      // Optimistically update the local state
      setLocalCart((old) =>
        old.map((item) => {
          if (item._id === cartId) {
            const minQty = item.productId?.MinQuantity || 1;
            let newQty = item.quantity;
            if (action === 'increment') newQty += 1;
            else if (action === 'decrement') newQty = Math.max(0, newQty - 1); // Note: Server handles deletion if 0
            return { ...item, quantity: newQty };
          }
          return item;
        }).filter(item => item.quantity > 0 || action === 'increment')
      );

      return { previousCart };
    },
    onError: (err, variables, context) => {
      // Rollback to previous state if error
      if (context?.previousCart) {
        setLocalCart(context.previousCart);
      }
      toast.error('Failed to update cart. Please try again.');
    },
    onSettled: () => {
      // Refresh cart data from server to ensure sync
      queryClient.invalidateQueries({ queryKey: ['cart', user?.uid] });
    },
  });

  const deleteCartMutation = useMutation({
    mutationFn: async ({ cartId, uid, productId }) => {
      const { data } = await api.delete('deleteCart', {
        data: { cartId, uid, productId }
      });
      return data;
    },
    onMutate: async ({ cartId }) => {
      setLocalCart((old) => old.filter((i) => i._id !== cartId));
    },
    onError: (err) => {
      toast.error('Failed to delete item');
      // Ideally rollback here too if we had a snapshot
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.uid] });
    }
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
    updateCartMutation.mutate({ cartId: id, action: action === 'increase' ? 'increment' : 'decrement' });
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

  const handleDelete = (item) => {
    deleteCartMutation.mutate({
      cartId: item._id,
      uid: item.uid,
      productId: item.productId?._id,
    });
  };

  const total = localCart.reduce((acc, item) => {
    const price = item.price || 0;
    return acc + price * item.quantity;
  }, 0);

  const handleInquiry = () => {
    if (!user?.uid) {
      toast.error("User ID not found. Please log in.");
      return;
    }
    setShowAddressModal(true);
  };

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
      const { data } = await api.post('submitInquiry', inquiryData);

      await api.delete('clearCart', { data: { uid } });

      setLocalCart([]);
      setShowAddressModal(false);
      toast.success("Inquiry submitted and cart cleared!");
      onClose();
    } catch (err) {
      console.error("Inquiry error:", err);
      const errorMessage = err.response?.data?.message || "Something went wrong while sending inquiry";
      toast.error(errorMessage);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={onClose}
      />

      {/* Cart Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-gradient-to-b from-white via-white to-amber-50/30 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${show ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Top amber accent stripe */}
        <div className="h-1 w-full bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300" />

        <div className="flex flex-col h-[calc(100%-4px)]">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-amber-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Your Cart</h2>
                <p className="text-xs text-amber-600 font-medium">
                  {localCart.length} {localCart.length === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-5 py-3">
            {localCart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium">Your cart is empty</p>
                <p className="text-xs text-gray-400 mt-1">Add some crystals to get started</p>
              </div>
            ) : (
              localCart.map((item) => {
                const price = item.price || item.productId?.dollarPrice;
                const minQty = item.productId?.MinQuantity || 1;

                return (
                  <div key={item._id} className="flex gap-3 border-b border-amber-100/60 py-4 items-start group">
                    {/* Image */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-amber-100 flex-shrink-0 shadow-sm">
                      <img
                        src={item.productId?.mainImage?.url}
                        alt={item.productId?.productName || 'Product'}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-semibold text-sm text-gray-800 line-clamp-1">
                          {item.productId?.productName}
                        </h3>
                        <button
                          onClick={() => handleDelete(item)}
                          className="flex-shrink-0 w-6 h-6 rounded-md bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors"
                        >
                          <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      {item.selectedSize && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          Size: <span className="font-medium text-gray-700">{item.selectedSize}</span>
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-0 border border-amber-200 rounded-lg overflow-hidden">
                          <button
                            onMouseDown={() => startQuantityChange(item._id, 'decrease')}
                            onMouseUp={() => stopQuantityChange(item._id)}
                            onMouseLeave={() => stopQuantityChange(item._id)}
                            onTouchStart={() => startQuantityChange(item._id, 'decrease')}
                            onTouchEnd={() => stopQuantityChange(item._id)}
                            disabled={item.quantity <= minQty}
                            className="w-7 h-7 flex items-center justify-center text-amber-700 hover:bg-amber-50 disabled:opacity-30 transition-colors text-sm font-bold"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-sm font-semibold text-gray-800 bg-amber-50/50">{item.quantity}</span>
                          <button
                            onMouseDown={() => startQuantityChange(item._id, 'increase')}
                            onMouseUp={() => stopQuantityChange(item._id)}
                            onMouseLeave={() => stopQuantityChange(item._id)}
                            onTouchStart={() => startQuantityChange(item._id, 'increase')}
                            onTouchEnd={() => stopQuantityChange(item._id)}
                            className="w-7 h-7 flex items-center justify-center text-amber-700 hover:bg-amber-50 transition-colors text-sm font-bold"
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <p className="text-sm font-bold text-amber-700">
                          {showInDollar
                            ? `$${(price * item.quantity).toFixed(2)}`
                            : `₹${(price * item.quantity).toFixed(0)}`}
                        </p>
                      </div>

                      {minQty > 1 && (
                        <p className="text-[10px] text-amber-500 mt-1">Min. {minQty} pcs required</p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer — Total & CTA */}
          {localCart.length > 0 && (
            <div className="border-t border-amber-200/60 bg-gradient-to-b from-amber-50/50 to-amber-100/30 p-5">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total</span>
                <span className="text-xl font-black text-gray-900">
                  {showInDollar ? `$${total.toFixed(2)}` : `₹${total.toFixed(0)}`}
                </span>
              </div>
              <button
                onClick={handleInquiry}
                className="w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98] uppercase tracking-wider"
              >
                Make Inquiry for Order
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md border border-amber-100">
            {/* Modal accent */}
            <div className="h-1 w-16 mx-auto rounded-full bg-gradient-to-r from-amber-400 to-amber-500 mb-4" />
            <h2 className="text-lg font-bold text-gray-900 mb-1 text-center">Shipping Address</h2>
            <p className="text-xs text-gray-400 mb-4 text-center">Where should we deliver your crystals?</p>

            {isAddressComplete() && !address.editing ? (
              <>
                <div className="text-sm space-y-2 mb-4 p-4 bg-amber-50/50 rounded-xl border border-amber-100">
                  <p><span className="font-semibold text-gray-700">Street:</span> {address.street}</p>
                  <p><span className="font-semibold text-gray-700">City:</span> {address.city}</p>
                  <p><span className="font-semibold text-gray-700">State:</span> {address.state}</p>
                  <p><span className="font-semibold text-gray-700">Postal Code:</span> {address.postalCode}</p>
                  <p><span className="font-semibold text-gray-700">Country:</span> {address.country}</p>
                </div>
                <div className="flex justify-between mt-4 gap-3">
                  <button
                    onClick={() => setAddress((prev) => ({ ...prev, editing: true }))}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 font-medium text-sm transition-colors"
                  >
                    Modify
                  </button>
                  <button
                    onClick={submitInquiryWithAddress}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium text-sm shadow-md transition-all"
                  >
                    Confirm & Submit
                  </button>
                </div>
              </>
            ) : (
              <>
                {["Street Address", "City", "State", "Postal Code", "Country"].map((label, i) => {
                  const keys = ["street", "city", "state", "postalCode", "country"];
                  return (
                    <input
                      key={keys[i]}
                      type="text"
                      className="w-full border border-amber-200/60 rounded-xl p-3 mt-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-300 bg-white placeholder-gray-400 transition-all"
                      placeholder={label}
                      value={address[keys[i]]}
                      onChange={(e) => setAddress({ ...address, [keys[i]]: e.target.value })}
                    />
                  );
                })}
                <div className="flex justify-end mt-5 gap-3">
                  <button
                    onClick={() => {
                      setShowAddressModal(false);
                      setAddress((prev) => ({ ...prev, editing: false }));
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 font-medium text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitInquiryWithAddress}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium text-sm shadow-md transition-all"
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
