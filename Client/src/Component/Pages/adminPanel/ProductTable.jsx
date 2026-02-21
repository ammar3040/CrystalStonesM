import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Pencil,
  Trash2,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Star,
  ArrowUpDown,
  Filter,
  Image as ImageIcon,
  Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const ProductTable = () => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortColumn, setSortColumn] = useState(-1);
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBestProducts, setSelectedBestProducts] = useState([]);
  const [isSavingBest, setIsSavingBest] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/all?page=${currentPage}&limit=${rowsPerPage}&search=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setAllProducts(data.products || []);
      setTotalRows(data.totalCount || 0);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, rowsPerPage]);

  useEffect(() => {
    const fetchBestProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/all?bestproduct=true&limit=1000`);
        const data = await response.json();
        const bestProducts = (data.products || []).map(product => product._id);
        setSelectedBestProducts(bestProducts);
      } catch (err) {
        console.error("Error fetching best products:", err);
      }
    };
    fetchBestProducts();
  }, []);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  const handleBestProductChange = (productId) => {
    setSelectedBestProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleSubmitBestProducts = async (e) => {
    if (e) e.preventDefault();
    setIsSavingBest(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/setbestproductlist`, { bestProducts: selectedBestProducts });
      toast.success('Best products updated successfully!');
    } catch (err) {
      toast.error('Error updating best products');
      console.error(err);
    } finally {
      setIsSavingBest(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (!confirmDelete) return;

    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/deleteProduct/?id=${id}`);
      if (res.data.success) {
        toast.success('Product deleted successfully!');
        fetchProducts();
      } else {
        toast.error(res.data.message || 'Failed to delete product.');
      }
    } catch (err) {
      toast.error('Server error while deleting product.');
      console.error(err);
    }
  };

  const sortProducts = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getSortedProducts = () => {
    if (sortColumn < 0) return allProducts;
    return [...allProducts].sort((a, b) => {
      const aValue = getSortValue(a, sortColumn);
      const bValue = getSortValue(b, sortColumn);
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const getSortValue = (product, column) => {
    switch (column) {
      case 1: return product.modelNumber?.toLowerCase() || '';
      case 2: return product.productName?.toLowerCase() || '';
      case 3: return product.category?.toLowerCase() || '';
      case 4: return product.dollarPrice || 0;
      case 5: return product.originalPrice || 0;
      case 6: return product.crystalType?.toLowerCase() || '';
      default: return '';
    }
  };

  const displayProducts = getSortedProducts();
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + allProducts.length, totalRows);

  const TableHeader = ({ label, column, sortable = true, align = 'left' }) => (
    <th
      className={cn(
        "px-4 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider transition-colors",
        sortable && "cursor-pointer hover:bg-zinc-50",
        align === 'right' && "text-right",
        align === 'center' && "text-center"
      )}
      onClick={() => sortable && sortProducts(column)}
    >
      <div className={cn("flex items-center gap-1", align === 'right' && "justify-end", align === 'center' && "justify-center")}>
        {label}
        {sortable && <ArrowUpDown size={12} className={cn("transition-opacity", sortColumn === column ? "opacity-100 text-indigo-600" : "opacity-0")} />}
      </div>
    </th>
  );

  return (
    <div className="space-y-6 max-w-[100vw] overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Product Inventory</h1>
          <p className="text-zinc-500">Manage your crystal collection and set featured products.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSubmitBestProducts}
            disabled={isSavingBest}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-xl text-sm font-bold text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none"
          >
            {isSavingBest ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
            <span>Save Best Products</span>
          </button>
          <button
            onClick={() => navigate('/admin-a9xK72rQ1m8vZpL0/add-product')}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-xl text-sm font-bold text-white hover:bg-zinc-800 transition-all"
          >
            <Plus size={18} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Table Controls */}
        <div className="p-4 border-b border-zinc-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-zinc-50/30">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search by name, model, category..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyUp={(e) => e.key === 'Enter' && handleSearchSubmit()}
              />
            </div>
            <button className="p-2 text-zinc-500 hover:bg-white border border-transparent hover:border-zinc-200 rounded-xl transition-all">
              <Filter size={20} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-500 font-medium">Show</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-zinc-200 rounded-lg px-2 py-1 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {[10, 25, 50, 100].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50">
                <TableHeader label="Best" sortable={false} align="center" />
                <TableHeader label="Model" column={1} />
                <TableHeader label="Product" column={2} />
                <TableHeader label="Category" column={3} />
                <TableHeader label="Price" column={4} align="right" />
                <TableHeader label="Original" column={5} align="right" />
                <TableHeader label="Crystal" column={6} />
                <th className="px-4 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  [...Array(rowsPerPage)].map((_, i) => (
                    <tr key={`skeleton-${i}`} className="animate-pulse">
                      <td colSpan={8} className="px-4 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 bg-zinc-100 rounded-lg"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-zinc-100 rounded w-1/4"></div>
                            <div className="h-3 bg-zinc-100 rounded w-1/2"></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : displayProducts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
                          <ImageIcon size={32} />
                        </div>
                        <p className="text-zinc-900 font-bold">No products found</p>
                        <p className="text-zinc-500 text-sm">Try adjusting your search or filters.</p>
                        <button
                          onClick={() => setSearchQuery('')}
                          className="mt-2 text-indigo-600 font-bold text-sm hover:underline"
                        >
                          Clear all filters
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  displayProducts.map((product, index) => (
                    <motion.tr
                      key={product._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      className="hover:bg-zinc-50/80 transition-colors group"
                    >
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => handleBestProductChange(product._id)}
                          className={cn(
                            "p-2 rounded-lg transition-all",
                            selectedBestProducts.includes(product._id)
                              ? "text-amber-500 bg-amber-50"
                              : "text-zinc-300 hover:bg-zinc-100"
                          )}
                        >
                          <Star size={18} fill={selectedBestProducts.includes(product._id) ? "currentColor" : "none"} />
                        </button>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono font-bold text-zinc-500">{product.modelNumber}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-xl bg-zinc-100 overflow-hidden border border-zinc-200 flex-shrink-0">
                            <img
                              src={product.mainImage?.url || "https://via.placeholder.com/50"}
                              alt={product.productName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-zinc-900 truncate max-w-[200px]">{product.productName}</p>
                            <p className="text-xs text-zinc-500 font-medium">{product.benefits?.[0] || 'Premium Crystal'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-600">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="text-sm font-bold text-emerald-600">
                          ${product.dollarPrice || '0.00'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="text-xs font-medium text-zinc-400 line-through">
                          ${product.originalPrice || '0.00'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-zinc-600 font-medium italic">{product.crystalType}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => navigate(`/admin-a9xK72rQ1m8vZpL0/edit-product/${product._id}`)}
                            className="p-2 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            title="Edit Product"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Delete Product"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Improved Pagination */}
        {!loading && totalPages > 1 && (
          <div className="px-6 py-4 bg-zinc-50/50 border-t border-zinc-100 flex items-center justify-between">
            <p className="text-sm text-zinc-500">
              Showing <span className="font-bold text-zinc-900">{startIndex + 1}</span> to <span className="font-bold text-zinc-900">{endIndex}</span> of <span className="font-bold text-zinc-900">{totalRows}</span>
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-white hover:border-zinc-200 border border-transparent disabled:opacity-30 disabled:hover:border-transparent transition-all"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex items-center gap-1 px-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (currentPage <= 3) pageNum = i + 1;
                  else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = currentPage - 2 + i;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={cn(
                        "w-9 h-9 flex items-center justify-center rounded-xl text-sm font-bold transition-all",
                        currentPage === pageNum
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 rotate-3"
                          : "text-zinc-500 hover:bg-white hover:border-zinc-200 border border-transparent"
                      )}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-white hover:border-zinc-200 border border-transparent disabled:opacity-30 disabled:hover:border-transparent transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTable;