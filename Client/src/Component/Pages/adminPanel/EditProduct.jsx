import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Package,
  Tag,
  Layers,
  Image as ImageIcon,
  Plus,
  Trash2,
  Info,
  DollarSign,
  Maximize2,
  ListPlus,
  ArrowRight,
  Upload,
  X,
  Sparkles,
  Save,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const steps = [
  { id: 1, title: "Product Basics", icon: Package, description: "Core identity & categorization" },
  { id: 2, title: "Price & Stock", icon: DollarSign, description: "Pricing model & availability" },
  { id: 3, title: "Details & Sizes", icon: Layers, description: "Specifications & variations" },
  { id: 4, title: "Visual Media", icon: ImageIcon, description: "Showcase your product" },
];

const EditProduct = () => {
  const { pid } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    modelNumber: "",
    productName: "",
    description: "",
    category: "",
    originalPrice: "",
    discountedPrice: "",
    dollarPrice: "",
    quantityUnit: "",
    MinQuantity: "",
    crystalType: "",
    benefits: [],
    specialNotes: "",
    length: "",
    width: "",
    height: "",
    sizes: [{ size: "", price: "" }],
  });

  const [specifications, setSpecifications] = useState([{ key: "", value: "" }]);
  const [mainImage, setMainImage] = useState(null);
  const [existingMainImageUrl, setExistingMainImageUrl] = useState("");
  const [additionalImages, setAdditionalImages] = useState([]);
  const [existingAdditionalImages, setExistingAdditionalImages] = useState([]);
  const [removedAdditionalImages, setRemovedAdditionalImages] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/EditPage/?id=${pid}`);
        if (res.data.success) {
          const product = res.data.product;
          setFormData({
            modelNumber: product.modelNumber || "",
            productName: product.productName || "",
            description: product.description || "",
            category: product.category || "",
            originalPrice: product.originalPrice || "",
            discountedPrice: product.discountedPrice || "",
            dollarPrice: product.dollarPrice || "",
            quantityUnit: product.quantityUnit || "",
            MinQuantity: product.MinQuantity || "",
            crystalType: product.crystalType || "",
            benefits: product.benefits || [],
            specialNotes: product.specialNotes || "",
            length: product.dimensions?.length || "",
            width: product.dimensions?.width || "",
            height: product.dimensions?.height || "",
            sizes: product.sizes?.length > 0 ? product.sizes : [{ size: "", price: "" }],
          });
          setSpecifications(product.specifications || [{ key: "", value: "" }]);
          setExistingMainImageUrl(product.mainImage?.url || "");
          setExistingAdditionalImages(product.additionalImages || []);
          setCategories(res.data.categories || []);
        } else {
          toast.error("Product not found");
          navigate("/admin-a9xK72rQ1m8vZpL0/view-products");
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        toast.error("Error loading product");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [pid, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSizeChange = (index, field, value) => {
    const updatedSizes = [...formData.sizes];
    updatedSizes[index][field] = value;
    setFormData(prev => ({ ...prev, sizes: updatedSizes }));
  };

  const addSize = () => {
    setFormData(prev => ({
      ...prev,
      sizes: [...prev.sizes, { size: "", price: "" }]
    }));
  };

  const removeSize = (index) => {
    if (formData.sizes.length === 1) return;
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }));
  };

  const handleSpecChange = (index, field, value) => {
    const updated = [...specifications];
    updated[index][field] = value;
    setSpecifications(updated);
  };

  const addSpec = () => setSpecifications([...specifications, { key: "", value: "" }]);
  const removeSpec = (index) => {
    if (specifications.length === 1) return;
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (index) => {
    const imageToRemove = existingAdditionalImages[index];
    setRemovedAdditionalImages(prev => [...prev, imageToRemove.public_id]);
    setExistingAdditionalImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "benefits") {
        formData.benefits.forEach((b) => form.append("benefits", b));
      } else if (key === "sizes") {
        form.append("sizes", JSON.stringify(formData.sizes.filter(s => s.size && s.price)));
      } else {
        form.append(key, formData[key]);
      }
    });

    form.append("id", pid);
    const validSpecs = specifications.filter(spec => spec.key.trim() && spec.value.trim());
    form.append('specifications', JSON.stringify(validSpecs));

    if (mainImage) form.append("mainImage", mainImage);
    additionalImages.forEach((img) => form.append("additionalImages", img));
    removedAdditionalImages.forEach((id) => form.append("removedAdditionalImages", id));

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/admin/updateData`, form, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data.success) {
        toast.success("Product updated successfully!");
        navigate("/admin-a9xK72rQ1m8vZpL0/view-products");
      } else {
        toast.error(res.data.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-zinc-50">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
        <p className="text-zinc-500 font-medium animate-pulse">Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors mb-2 text-sm font-medium group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Products
          </button>
          <h1 className="text-2xl font-bold text-zinc-900">Edit Product</h1>
          <p className="text-zinc-500 text-sm">Update "{formData.productName}" details and visuals.</p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mb-10 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-100 -translate-y-1/2 z-0 hidden md:block" />
        <div className="flex flex-wrap justify-between gap-4 relative z-10">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div
                key={step.id}
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => (isCompleted || step.id < currentStep) && setCurrentStep(step.id)}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ring-4",
                  isActive ? "bg-indigo-600 text-white shadow-xl ring-indigo-50" :
                    isCompleted ? "bg-emerald-500 text-white ring-emerald-50" : "bg-white text-zinc-400 border border-zinc-200 ring-transparent"
                )}>
                  {isCompleted ? <Check size={18} /> : <Icon size={18} />}
                </div>
                <div className="hidden sm:block">
                  <p className={cn(
                    "text-xs font-bold uppercase tracking-wider",
                    isActive ? "text-indigo-600" : "text-zinc-400"
                  )}>{step.title}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Model Number</label>
                  <input
                    type="text"
                    name="modelNumber"
                    required
                    value={formData.modelNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none transition-all"
                    placeholder="e.g. CS-789"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Category</label>
                  <select
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none transition-all"
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => (
                      <option key={c._id} value={c.category}>{c.category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Product Name</label>
                <input
                  type="text"
                  name="productName"
                  required
                  value={formData.productName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-lg font-bold focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none transition-all"
                  placeholder="Amethyst Raw Cluster"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Description</label>
                <textarea
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none transition-all"
                  placeholder="Detailed product story..."
                />
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm space-y-6"
            >
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Selling Price ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                    <input
                      type="number"
                      name="dollarPrice"
                      required
                      value={formData.dollarPrice}
                      onChange={handleChange}
                      className="w-full pl-8 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none transition-all"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Unit</label>
                  <select
                    name="quantityUnit"
                    required
                    value={formData.quantityUnit}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none transition-all"
                  >
                    <option value="per/piece">Per Piece</option>
                    <option value="per/kg">Per Kg</option>
                    <option value="per/set">Per Set</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Min Order Qty</label>
                  <input
                    type="number"
                    name="MinQuantity"
                    required
                    min="1"
                    value={formData.MinQuantity}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>
              <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex items-start gap-3">
                <Info size={18} className="text-indigo-600 mt-0.5" />
                <p className="text-xs text-indigo-700 leading-relaxed font-semibold">
                  The discounted price is calculated automatically if an original price is provided.
                  Currently, "Selling Price" is the final price shown to customers.
                </p>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
                  <Maximize2 size={16} className="text-indigo-600" /> Physical Dimensions
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {['length', 'width', 'height'].map(dim => (
                    <div key={dim} className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{dim} (cm)</label>
                      <input
                        type="number"
                        name={dim}
                        step="0.1"
                        value={formData[dim]}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
                  <ListPlus size={16} className="text-indigo-600" /> Size Variations
                </h3>
                {formData.sizes.map((item, index) => (
                  <div key={index} className="flex gap-3 group items-end pb-4 border-b border-zinc-50 last:border-0 last:pb-0">
                    <div className="flex-1 space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400">Size Label</label>
                      <input
                        type="text"
                        value={item.size}
                        onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                        placeholder="e.g. Small"
                        className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400">Fixed Price ($)</label>
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => handleSizeChange(index, 'price', e.target.value)}
                        placeholder="0.00"
                        className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSize(index)}
                      className="p-2 text-zinc-400 hover:text-rose-500 bg-zinc-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addSize} className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                  <Plus size={14} /> Add Another Variation
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
                    <Sparkles size={16} className="text-amber-500" /> Main Showpiece
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <div className="relative w-full sm:w-48 aspect-square rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-50 group">
                      <img
                        src={mainImage ? URL.createObjectURL(mainImage) : existingMainImageUrl}
                        alt="Main"
                        className="w-full h-full object-cover"
                      />
                      <label className="absolute inset-0 bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                        <Upload size={24} />
                        <span className="text-[10px] font-bold mt-2 uppercase">Replace</span>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => setMainImage(e.target.files[0])} />
                      </label>
                    </div>
                    <div className="flex-1 space-y-3">
                      <p className="text-sm text-zinc-500 leading-relaxed">
                        This is the primary image shown in search results and at the top of the product page.
                        <strong>High resolution, white background recommended.</strong>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-100">
                  <h3 className="text-sm font-bold flex items-center gap-2 mb-4 text-zinc-900">
                    Gallery Collection
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    {/* Existing Gallery Images */}
                    {existingAdditionalImages.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-zinc-200 group">
                        <img src={img.url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(idx)}
                          className="absolute top-1.5 right-1.5 p-1.5 bg-white/90 backdrop-blur-sm text-rose-500 rounded-lg shadow-sm lg:opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}

                    {/* New Uploads */}
                    {additionalImages.map((file, idx) => (
                      <div key={`new-${idx}`} className="relative aspect-square rounded-xl overflow-hidden border border-indigo-200 ring-2 ring-indigo-50 group">
                        <img src={URL.createObjectURL(file)} alt="New" className="w-full h-full object-cover" />
                        <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-indigo-600 text-white text-[8px] font-bold rounded">NEW</div>
                        <button
                          type="button"
                          onClick={() => setAdditionalImages(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-1.5 right-1.5 p-1.5 bg-white/90 backdrop-blur-sm text-rose-500 rounded-lg shadow-sm"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}

                    {/* Upload Button */}
                    <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 rounded-xl hover:bg-zinc-50 hover:border-indigo-400 cursor-pointer transition-all group">
                      <Plus className="text-zinc-400 group-hover:text-indigo-600 group-hover:scale-110 transition-all" size={24} />
                      <span className="text-[10px] font-bold text-zinc-400 mt-2 uppercase tracking-tight group-hover:text-indigo-600">Add More</span>
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => setAdditionalImages(prev => [...prev, ...Array.from(e.target.files)])}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-6 border-t border-zinc-100">
          <button
            type="button"
            onClick={() => currentStep > 1 ? setCurrentStep(prev => prev - 1) : navigate(-1)}
            className="px-6 py-2.5 bg-white border border-zinc-200 text-zinc-700 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-zinc-50 transition-colors"
          >
            {currentStep === 1 ? "Discard Changes" : <><ChevronLeft size={16} /> Back</>}
          </button>

          <div className="flex items-center gap-3">
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="px-8 py-3 bg-zinc-900 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg hover:shadow-zinc-200 transition-all active:scale-95"
              >
                Continue Setup <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSaving}
                className="px-10 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <><Save size={18} /> Apply Updates</>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;