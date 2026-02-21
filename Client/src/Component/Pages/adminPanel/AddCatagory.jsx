import React, { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import {
  Search,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  Tag,
  Calendar,
  AlertCircle,
  Filter,
  ArrowUpDown,
  MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

function AddCategory() {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsFetching(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/getCatagory`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setIsFetching(false);
    }
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFilteredCategories = useMemo(() => {
    let filtered = [...categories];

    if (searchTerm) {
      filtered = filtered.filter(cat =>
        cat.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [categories, searchTerm, sortConfig]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mainImage) {
      toast.error("Please select a category image");
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("category", categoryName);
      formData.append("mainImage", mainImage);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/addcatagory`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to add category");

      toast.success(result.message || "Category added successfully");
      setCategories(prev => [...prev, result.category]);
      setCategoryName("");
      setMainImage(null);
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error(error.message || "Failed to add category");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (categoryId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/deletecatagory/?cid=${categoryId}`,
        { method: "GET" }
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to delete category");

      toast.success(result.message || "Category deleted successfully");
      setCategories(prev => prev.filter(cat => cat._id !== categoryId));
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  };

  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 w-4 bg-zinc-100 rounded" /></td>
      <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 w-32 bg-zinc-100 rounded" /></td>
      <td className="px-6 py-4 whitespace-nowrap"><div className="h-12 w-12 bg-zinc-100 rounded-lg" /></td>
      <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 w-24 bg-zinc-100 rounded" /></td>
      <td className="px-6 py-4 whitespace-nowrap text-center"><div className="h-8 w-8 bg-zinc-100 rounded-full mx-auto" /></td>
    </tr>
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Category Management</h1>
          <p className="text-zinc-500 text-sm">Organize your crystal collection into logical groups.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Add Category Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-zinc-900 mb-6 flex items-center gap-2">
              <Plus className="text-indigo-600" size={18} /> New Category
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Category Name</label>
                <div className="relative group">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
                  <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none transition-all"
                    placeholder="e.g. Rough Stones"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Thumbnail Image</label>
                <div className="relative">
                  {mainImage ? (
                    <div className="relative aspect-square rounded-2xl overflow-hidden border border-indigo-200 group">
                      <img src={URL.createObjectURL(mainImage)} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setMainImage(null)}
                        className="absolute inset-0 bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={24} />
                        <span className="text-xs font-bold mt-2 uppercase tracking-wide">Change Image</span>
                      </button>
                    </div>
                  ) : (
                    <label className="aspect-square flex flex-col items-center justify-center px-4 bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-2xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all group">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Upload className="text-indigo-600" size={20} />
                      </div>
                      <span className="text-xs font-bold text-zinc-900">Upload Icon</span>
                      <p className="text-[10px] text-zinc-400 mt-1 uppercase tracking-widest font-bold">Square 1:1 Recommended</p>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => setMainImage(e.target.files[0])} />
                    </label>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "w-full py-3 px-4 bg-zinc-900 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2",
                  isLoading && "opacity-50 cursor-not-allowed"
                )}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Create Category <ArrowUpDown size={16} className="rotate-90" /></>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Categories Table Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-zinc-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <Filter className="text-zinc-400" size={18} /> Active Categories
                <span className="ml-2 px-2 py-0.5 bg-zinc-100 text-zinc-500 text-[10px] rounded-full">{categories.length}</span>
              </h3>
              <div className="relative group min-w-[240px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
                <input
                  type="text"
                  placeholder="Quick find..."
                  className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-50/50">
                  <tr className="border-b border-zinc-100">
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-zinc-400 uppercase tracking-widest">#</th>
                    <th
                      className="px-6 py-4 text-left text-[10px] font-bold text-zinc-400 uppercase tracking-widest cursor-pointer hover:text-indigo-600 transition-colors"
                      onClick={() => requestSort('category')}
                    >
                      <div className="flex items-center gap-2">
                        Category Name <ArrowUpDown size={12} />
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Visual</th>
                    <th
                      className="px-6 py-4 text-left text-[10px] font-bold text-zinc-400 uppercase tracking-widest cursor-pointer hover:text-indigo-600 transition-colors"
                      onClick={() => requestSort('createdAt')}
                    >
                      <div className="flex items-center gap-2">
                        Added On <ArrowUpDown size={12} />
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  <AnimatePresence mode="popLayout">
                    {isFetching ? (
                      [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                    ) : sortedAndFilteredCategories.length > 0 ? (
                      sortedAndFilteredCategories.map((category, index) => (
                        <motion.tr
                          key={category._id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="hover:bg-zinc-50/50 group transition-colors"
                        >
                          <td className="px-6 py-4 text-xs font-medium text-zinc-400">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-zinc-900 capitalize">{category.category}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="w-12 h-12 rounded-xl border border-zinc-200 overflow-hidden bg-zinc-100 ring-4 ring-white shadow-sm group-hover:ring-indigo-50 transition-all">
                              <img
                                src={category.mainImage?.url || "https://via.placeholder.com/80"}
                                alt={category.category}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-zinc-500 font-medium">
                              <Calendar size={12} />
                              <span className="text-xs">
                                {new Date(category.createdAt).toLocaleDateString('en-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => {
                                if (window.confirm('Delete category? This action cannot be undone.')) {
                                  handleDelete(category._id);
                                }
                              }}
                              className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                              title="Delete Category"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <AlertCircle className="text-zinc-200" size={40} />
                            <p className="text-sm font-bold text-zinc-400">
                              {searchTerm ? `No category matched "${searchTerm}"` : "No categories yet"}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddCategory;