import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

function Inquiry({ show, onClose, user }) {
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    if (!user?.uid || !show) return;

    const fetchInquiries = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/getUserInquiries/${user.uid}`
        );
        const data = await res.json();

        if (res.ok) {
          setInquiries(data);
        } else {
          toast.error(data.message || "Failed to fetch inquiries");
        }
      } catch (err) {
        console.error("Error fetching inquiries:", err);
        toast.error("Something went wrong");
      }
    };

    fetchInquiries();
  }, [user?.uid, show]);

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <>
      {/* Backdrop */}
      {show && (
        <div
          className="fixed inset-0 bg-opacity-40 z-40"
          onClick={onClose}
        ></div>
      )}

      {/* Sliding Panel */}
      <div
        className={`fixed top-0 right-0 h-full max-w-md w-full bg-white z-50 shadow-lg transform transition-transform duration-300 ease-in-out ${
          show ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center border-b px-4 py-3">
          <h2 className="text-lg font-semibold">Your Inquiries</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-red-500 text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100vh-60px)]">
          {inquiries.length === 0 ? (
            <p className="text-gray-500">No inquiries found.</p>
          ) : (
            <div className="space-y-6">
              {inquiries.map((inq) => (
                <div
                  key={inq._id}
                  className="border border-gray-200 rounded-lg p-4 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">
                      Submitted: {formatDate(inq.submittedAt)}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        inq.status === "replied"
                          ? "bg-green-100 text-green-700"
                          : inq.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {inq.status}
                    </span>
                  </div>

                  {inq.address && (
                    <div className="mb-3 text-sm">
                      <p className="font-medium">Shipping Address:</p>
                      <p>{inq.address.street}, {inq.address.city}</p>
                      <p>{inq.address.state}, {inq.address.postalCode}</p>
                      <p>{inq.address.country}</p>
                    </div>
                  )}

                  <p className="text-sm text-gray-700 mb-3">
                    <strong>Message:</strong>{" "}
                    {inq.message || "No message provided"}
                  </p>

                  <div className="mt-2 space-y-3">
                    {inq.products.map((prod, idx) => {
                      const product = prod.productId;
                      const price = prod.selectedSize?.price || product?.dollarPrice || 0;
                      const totalPrice = price * prod.quantity;
                      
                      return (
                        <div
                          key={idx}
                          className="flex items-start border border-gray-100 rounded-md p-2"
                        >
                          <img
                            src={product?.mainImage?.url || "/img/noimage.png"}
                            alt={product?.productName || "Product"}
                            className="w-12 h-12 object-cover rounded border"
                          />
                          <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-800">
                              {product?.productName || "Unnamed Product"}
                            </p>
                            
                            {/* Display selected size if available */}
                        {prod.selectedSize&&(<p className="text-xs text-gray-600">
                                Size: {prod.selectedSize}
                              </p>)}
                              
                          
                            
                            <div className="flex justify-between items-center mt-1">
                              <p className="text-xs text-gray-500">
                                Qty: {prod.quantity}
                              </p>
                              <p className="text-xs font-medium">
                                ${totalPrice.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Inquiry;