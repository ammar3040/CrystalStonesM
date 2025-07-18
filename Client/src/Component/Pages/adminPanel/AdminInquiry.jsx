import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaSearch, FaFilter, FaEye, FaCheck, FaTimes, FaClock, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

function AdminInquiry() {
  const [inquiries, setInquiries] = useState([]);
  const [filteredInquiries, setFilteredInquiries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedInquiry, setExpandedInquiry] = useState(null);

  useEffect(() => {
    fetchAllInquiries();
  }, []);

  useEffect(() => {
    filterInquiries();
  }, [inquiries, searchTerm, statusFilter]);

  const fetchAllInquiries = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/getAllInquiries`);
      const data = await res.json();

      if (res.ok) {
        setInquiries(data);
      } else {
        toast.error(data.message || "Failed to fetch inquiries");
      }
    } catch (err) {
      console.error("Error fetching admin inquiries:", err);
      toast.error("Something went wrong");
    }
  };

  const filterInquiries = () => {
    let result = inquiries;

    if (statusFilter !== "all") {
      result = result.filter(inq => inq.status === statusFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(inq => 
        (inq.userId?.Uname?.toLowerCase().includes(term) ||
        inq.userId?.email?.toLowerCase().includes(term) ||
        inq.message?.toLowerCase().includes(term) ||
        inq.products.some(p => 
          p.productId?.productName?.toLowerCase().includes(term) ||
          p.productId?.modelNumber?.toLowerCase().includes(term)
        ))
      );
    }

    setFilteredInquiries(result);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/updateInquiryStatus/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (res.ok) {
        toast.success("Status updated successfully");
        fetchAllInquiries();
      } else {
        const data = await res.json();
        toast.error(data.message || "Update failed");
      }
    } catch (err) {
      console.error("Status update failed:", err);
      toast.error("Something went wrong");
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    
    switch(status) {
      case "pending":
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}><FaClock className="inline mr-1" /> Pending</span>;
      case "replied":
        return <span className={`${baseClasses} bg-green-100 text-green-800`}><FaCheck className="inline mr-1" /> Replied</span>;
      case "cancelled":
        return <span className={`${baseClasses} bg-red-100 text-red-800`}><FaTimes className="inline mr-1" /> Cancelled</span>;
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
    }
  };

  const ProductItem = ({ product }) => {
    const p = product.productId;
    return (
      <div className="flex items-start border border-gray-200 rounded p-3">
        <img
          src={p?.mainImage?.url || "/img/noimage.png"}
          alt={p?.productName || "Product"}
          className="w-16 h-16 object-cover rounded border"
        />
        <div className="ml-3 flex-grow">
          <p className="font-medium">
            {p?.productName || "Unnamed Product"}
          </p>
          <p className="text-sm text-gray-600">
            Model: {p?.modelNumber || "N/A"}
          </p>
          <p className="text-sm">
            Quantity: <span className="font-medium">{product.quantity}</span>
          </p>
          {product.size && (
            <p className="text-sm">
              Size: <span className="font-medium">{product.size}</span>
            </p>
          )}
          {product.sizePrice && (
            <p className="text-sm">
              Size Price: <span className="font-medium">${product.sizePrice}</span>
            </p>
          )}
        </div>
      </div>
    );
  };

  const CustomerInfo = ({ inquiry }) => {
    const user = inquiry.userId;
    const address = inquiry.address;
    
    return (
      <div className="bg-gray-50 p-4 rounded">
        <div className="space-y-3">
          <div className="flex items-start">
            <FaUser className="text-gray-500 mt-1 mr-2 flex-shrink-0" />
            <div>
              <p className="font-medium">{user?.Uname || "N/A"}</p>
              <p className="text-sm text-gray-600">Customer</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <FaEnvelope className="text-gray-500 mt-1 mr-2 flex-shrink-0" />
            <p className="text-sm">{user?.email || "N/A"}</p>
          </div>
          
          {user?.mobile && (
            <div className="flex items-start">
              <FaPhone className="text-gray-500 mt-1 mr-2 flex-shrink-0" />
              <p className="text-sm">{user.mobile}</p>
            </div>
          )}
          
          {address && (
            <>
              <div className="flex items-start">
                <FaMapMarkerAlt className="text-gray-500 mt-1 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium">Shipping Address</p>
                  <p className="text-sm">
                    {address.addressLine1}, {address.addressLine2 || ''}
                  </p>
                  <p className="text-sm">
                    {address.city}, {address.state} {address.postalCode}
                  </p>
                  <p className="text-sm">{address.country}</p>
                </div>
              </div>
              
              {address.landmark && (
                <p className="text-sm ml-6">Landmark: {address.landmark}</p>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Customer Inquiries</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search inquiries by name, email, product..."
            className="pl-10 w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="relative w-full md:w-48">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaFilter className="text-gray-400" />
          </div>
          <select
            className="pl-10 w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="replied">Replied</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>

      {filteredInquiries.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-500 text-lg">
            {inquiries.length === 0 
              ? "No inquiries submitted yet." 
              : "No inquiries match your filters."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="grid grid-cols-12 bg-gray-100 p-4 font-medium text-gray-700 text-sm">
            <div className="col-span-3">Customer</div>
            <div className="col-span-3">Products</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredInquiries.map((inq) => (
              <div key={inq._id} className="p-4 hover:bg-gray-50">
                <div className="grid grid-cols-12 items-center gap-4">
                  <div className="col-span-3">
                    <p className="font-medium">{inq.userId?.Uname || "N/A"}</p>
                    <p className="text-sm text-gray-600 truncate">{inq.userId?.email || "N/A"}</p>
                    {inq.userId?.mobile && (
                      <p className="text-sm text-gray-600">{inq.userId.mobile}</p>
                    )}
                  </div>

                  <div className="col-span-3">
                    <div className="flex flex-wrap gap-2">
                      {inq.products.slice(0, 2).map((prod, idx) => (
                        <div key={idx} className="flex items-center max-w-full">
                          <img
                            src={prod.productId?.mainImage?.url || "/img/noimage.png"}
                            alt={prod.productId?.productName || "Product"}
                            className="w-8 h-8 object-cover rounded border"
                          />
                          <div className="ml-2 truncate">
                            <p className="text-sm truncate">
                              {prod.productId?.productName || "Unnamed Product"}
                            </p>
                            <p className="text-xs text-gray-500">
                              Qty: {prod.quantity} {prod.size && `| Size: ${prod.size}`}
                            </p>
                          </div>
                        </div>
                      ))}
                      {inq.products.length > 2 && (
                        <span className="text-sm text-gray-500">
                          +{inq.products.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="col-span-2 text-sm text-gray-600">
                    {formatDate(inq.submittedAt)}
                  </div>

                  <div className="col-span-2">
                    {getStatusBadge(inq.status)}
                  </div>

                  <div className="col-span-2 flex justify-end space-x-2">
                    <button
                      onClick={() => setExpandedInquiry(expandedInquiry === inq._id ? null : inq._id)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="View details"
                    >
                      <FaEye />
                    </button>
                  </div>
                </div>

                {expandedInquiry === inq._id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-1">
                        <h3 className="font-medium mb-2">Customer Information</h3>
                        <CustomerInfo inquiry={inq} />
                      </div>

                      <div className="lg:col-span-2">
                        <h3 className="font-medium mb-2">Products ({inq.products.length})</h3>
                        <div className="space-y-3">
                          {inq.products.map((prod, idx) => (
                            <ProductItem key={idx} product={prod} />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h3 className="font-medium mb-2">Customer Message</h3>
                      <div className="bg-gray-50 p-4 rounded whitespace-pre-wrap">
                        {inq.message || "No message provided"}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium mr-2">Update Status:</span>
                        <select
                          value={inq.status}
                          onChange={(e) => handleStatusChange(inq._id, e.target.value)}
                          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="replied">Replied</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                      <button
                        onClick={() => setExpandedInquiry(null)}
                        className="text-gray-500 hover:text-gray-700 text-sm"
                      >
                        Close details
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminInquiry;