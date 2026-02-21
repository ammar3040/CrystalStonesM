import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  ChevronDown,
  ChevronUp,
  User,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  ExternalLink,
  Package,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const AdminInquiry = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/getInquiry`);
      setInquiries(response.data.reverse());
    } catch (err) {
      toast.error("Failed to fetch inquiries");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/updateInquiryStatus/?id=${id}&status=${status}`);
      if (response.data.success) {
        toast.success(`Inquiry marked as ${status}`);
        setInquiries((prev) =>
          prev.map((inq) => (inq._id === id ? { ...inq, status: status } : inq))
        );
      }
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesEmail = inquiry.customerInfo?.email?.toLowerCase().includes(searchEmail.toLowerCase()) ||
      inquiry.customerInfo?.name?.toLowerCase().includes(searchEmail.toLowerCase());
    const matchesStatus = filterStatus === "all" || inquiry.status === filterStatus;
    return matchesEmail && matchesStatus;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      pending: "bg-amber-100 text-amber-700 border-amber-200",
      processed: "bg-emerald-100 text-emerald-700 border-emerald-200",
      rejected: "bg-rose-100 text-rose-700 border-rose-200",
    };
    const icons = {
      pending: <Clock size={12} />,
      processed: <CheckCircle2 size={12} />,
      rejected: <XCircle size={12} />,
    };

    return (
      <span className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
        styles[status] || styles.pending
      )}>
        {icons[status] || icons.pending}
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Customer Inquiries</h1>
          <p className="text-zinc-500">Handle product questions and booking requests.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative group w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 bg-white border border-zinc-200 p-1 rounded-xl w-full sm:w-auto">
            {['all', 'pending', 'processed', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={cn(
                  "px-3 py-1.5 text-xs font-bold capitalize rounded-lg transition-all",
                  filterStatus === status
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "text-zinc-500 hover:bg-zinc-100"
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-white border border-zinc-200 rounded-2xl animate-pulse" />
            ))
          ) : filteredInquiries.length === 0 ? (
            <div className="bg-white border border-zinc-200 rounded-3xl p-20 text-center">
              <div className="flex flex-col items-center gap-3">
                <MessageSquare size={48} className="text-zinc-200" />
                <p className="text-lg font-bold text-zinc-900">No inquiries found</p>
                <p className="text-zinc-500">All caught up! No messages to display.</p>
              </div>
            </div>
          ) : (
            filteredInquiries.map((inquiry, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                key={inquiry._id}
                className={cn(
                  "bg-white border rounded-2xl transition-all overflow-hidden",
                  expandedId === inquiry._id
                    ? "border-indigo-200 shadow-xl shadow-indigo-50 ring-1 ring-indigo-50"
                    : "border-zinc-200 shadow-sm hover:border-zinc-300"
                )}
              >
                <div
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                  onClick={() => setExpandedId(expandedId === inquiry._id ? null : inquiry._id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold border transition-colors",
                      expandedId === inquiry._id ? "bg-indigo-600 text-white border-transparent" : "bg-zinc-50 text-zinc-600 border-zinc-100"
                    )}>
                      {inquiry.customerInfo?.name?.charAt(0).toUpperCase() || <User size={20} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-zinc-900">{inquiry.customerInfo?.name || 'Unknown Subject'}</h3>
                        <StatusBadge status={inquiry.status} />
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500 font-medium">
                        <span className="flex items-center gap-1"><Mail size={12} /> {inquiry.customerInfo?.email}</span>
                        <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(inquiry.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-zinc-50 rounded-lg border border-zinc-100">
                      <Package size={14} className="text-zinc-400" />
                      <span className="text-xs font-bold text-zinc-700">{inquiry.items?.length || 0} Products</span>
                    </div>
                    {expandedId === inquiry._id ? <ChevronUp className="text-zinc-400" /> : <ChevronDown className="text-zinc-400" />}
                  </div>
                </div>

                <AnimatePresence>
                  {expandedId === inquiry._id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-zinc-100 bg-zinc-50/30"
                    >
                      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                          <div>
                            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                              <MessageSquare size={12} /> Customer Message
                            </h4>
                            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm relative">
                              <p className="text-zinc-700 text-sm leading-relaxed italic">"{inquiry.customerInfo?.message || 'No message provided.'}"</p>
                              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-l border-b border-zinc-200 rotate-45" />
                            </div>
                          </div>

                          <div>
                            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                              <Package size={12} /> Inquired Products
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {inquiry.items?.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 bg-white border border-zinc-200 rounded-xl hover:border-indigo-200 transition-colors group">
                                  <div className="w-12 h-12 rounded-lg bg-zinc-100 overflow-hidden border border-zinc-100 flex-shrink-0">
                                    <img src={item.mainImage?.url} alt={item.productName} className="w-full h-full object-cover" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-xs font-bold text-zinc-900 truncate">{item.productName}</p>
                                    <p className="text-[10px] text-indigo-600 font-bold">{item.category}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
                            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                              <User size={12} /> Contact Details
                            </h4>
                            <div className="space-y-3">
                              <div className="flex items-start gap-3">
                                <Mail className="text-zinc-400 mt-0.5" size={14} />
                                <div className="min-w-0">
                                  <p className="text-[10px] text-zinc-400 font-bold uppercase">Email</p>
                                  <p className="text-sm font-medium text-zinc-900 truncate">{inquiry.customerInfo?.email}</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <Phone className="text-zinc-400 mt-0.5" size={14} />
                                <div>
                                  <p className="text-[10px] text-zinc-400 font-bold uppercase">Phone</p>
                                  <p className="text-sm font-medium text-zinc-900">{inquiry.customerInfo?.mobile || 'Not provided'}</p>
                                </div>
                              </div>
                            </div>
                            <button className="w-full py-2 bg-zinc-900 text-white rounded-lg text-xs font-bold hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2">
                              <Mail size={14} /> Reply to Customer
                            </button>
                          </div>

                          <div className="bg-zinc-900 p-5 rounded-2xl shadow-lg space-y-4">
                            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                              <Layers size={12} /> Update Status
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => handleStatusChange(inquiry._id, 'processed')}
                                className={cn(
                                  "py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2",
                                  inquiry.status === 'processed'
                                    ? "bg-emerald-600 text-white"
                                    : "bg-white/10 text-white hover:bg-white/20"
                                )}
                              >
                                <CheckCircle2 size={14} /> Process
                              </button>
                              <button
                                onClick={() => handleStatusChange(inquiry._id, 'rejected')}
                                className={cn(
                                  "py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2",
                                  inquiry.status === 'rejected'
                                    ? "bg-rose-600 text-white"
                                    : "bg-white/10 text-white hover:bg-white/20"
                                )}
                              >
                                <XCircle size={14} /> Reject
                              </button>
                            </div>
                            {inquiry.status !== 'pending' && (
                              <button
                                onClick={() => handleStatusChange(inquiry._id, 'pending')}
                                className="w-full py-2 bg-white/5 text-zinc-400 rounded-lg text-xs font-bold hover:bg-white/10 transition-colors"
                              >
                                Reset to Pending
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminInquiry;