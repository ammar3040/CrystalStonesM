import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Package,
  Tag,
  FileText,
  DollarSign,
  Layers,
  Image as ImageIcon,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Box,
  Maximize,
  HelpCircle,
  X,
  Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// ── Sub-components defined OUTSIDE to prevent re-mount on every keystroke ──

const StepIndicator = ({ step }) => (
  <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto">
    {[1, 2, 3, 4].map((num) => (
      <React.Fragment key={num}>
        <div className="flex flex-col items-center relative gap-2">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
            step >= num ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-zinc-200 text-zinc-400"
          )}>
            {step > num ? <CheckCircle2 size={18} /> : <span>{num}</span>}
          </div>
          <span className={cn(
            "text-[10px] font-bold uppercase tracking-wider absolute -bottom-6 w-max",
            step === num ? "text-indigo-600" : "text-zinc-400"
          )}>
            {num === 1 ? "Basics" : num === 2 ? "Pricing" : num === 3 ? "Specs" : "Media"}
          </span>
        </div>
        {num < 4 && (
          <div className={cn(
            "flex-1 h-0.5 mx-4 transition-all duration-300",
            step > num ? "bg-indigo-600" : "bg-zinc-100"
          )} />
        )}
      </React.Fragment>
    ))}
  </div>
);

const InputWrapper = ({ label, id, children, icon: Icon }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
      {Icon && <Icon size={12} />} {label}
    </label>
    {children}
  </div>
);

const FormInput = (props) => (
  <input
    {...props}
    className={cn(
      "w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-zinc-300",
      props.className
    )}
  />
);

const FormTextArea = (props) => (
  <textarea
    {...props}
    className={cn(
      "w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-zinc-300 min-h-[100px]",
      props.className
    )}
  />
);

// ── Main Component ──

const AddProduct = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

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
  const [additionalImages, setAdditionalImages] = useState([]);
  const [catagorys, setCatagorys] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCatagorys();
  }, []);

  const fetchCatagorys = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/getCatagory`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setCatagorys(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        benefits: checked
          ? [...prev.benefits, value]
          : prev.benefits.filter((b) => b !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (name === "category") {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/specifications-by-category?category=${value}`);
          const data = await response.json();
          if (response.ok) {
            setSpecifications(data.specifications);
            toast.success("Specifications auto-filled!");
          } else {
            setSpecifications([{ key: "", value: "" }]);
          }
        } catch (error) {
          console.error("Error fetching specifications:", error);
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'benefits') {
        formData.benefits.forEach((b) => form.append('benefits', b));
      } else if (key === 'sizes') {
        form.append('sizes', JSON.stringify(formData.sizes));
      } else {
        form.append(key, formData[key]);
      }
    });

    const validSpecs = specifications.filter(spec => spec.key.trim() && spec.value.trim());
    form.append('specifications', JSON.stringify(validSpecs));

    if (mainImage) form.append('mainImage', mainImage);
    additionalImages.forEach((img) => form.append('additionalImages', img));

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/AddProduct`, {
        method: 'POST',
        body: form,
      });

      if (response.ok) {
        toast.success("Product added successfully!");
        window.location.reload();
      } else {
        toast.error("Failed to add product.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-zinc-900">Add New Product</h1>
        <p className="text-zinc-500 mt-2">Fill in the details to list a new crystal item.</p>
      </div>

      <StepIndicator step={step} />

      <form onSubmit={handleSubmit} className="bg-white border border-zinc-200 rounded-3xl shadow-sm p-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputWrapper label="Model Number" id="modelNumber" icon={Tag}>
                  <FormInput
                    id="modelNumber"
                    name="modelNumber"
                    required
                    value={formData.modelNumber}
                    onChange={handleChange}
                    placeholder="e.g. CR-001"
                  />
                </InputWrapper>
                <InputWrapper label="Product Name" id="productName" icon={Package}>
                  <FormInput
                    id="productName"
                    name="productName"
                    required
                    value={formData.productName}
                    onChange={handleChange}
                    placeholder="e.g. Amethyst Point"
                  />
                </InputWrapper>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputWrapper label="Category" id="category" icon={Layers}>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select Category</option>
                    {catagorys.map((cat, i) => (
                      <option key={i} value={cat.category}>{cat.category}</option>
                    ))}
                  </select>
                </InputWrapper>
                <InputWrapper label="Crystal Type" id="crystalType" icon={Layers}>
                  <FormInput
                    id="crystalType"
                    name="crystalType"
                    required
                    value={formData.crystalType}
                    onChange={handleChange}
                    placeholder="e.g. Quartz"
                  />
                </InputWrapper>
              </div>

              <InputWrapper label="Description" id="description" icon={FileText}>
                <FormTextArea
                  id="description"
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the product features and qualities..."
                />
              </InputWrapper>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputWrapper label="Price ($)" id="dollarPrice" icon={DollarSign}>
                  <FormInput
                    type="number"
                    id="dollarPrice"
                    name="dollarPrice"
                    step="0.01"
                    required
                    value={formData.dollarPrice}
                    onChange={handleChange}
                  />
                </InputWrapper>
                <InputWrapper label="Quantity Unit" id="quantityUnit" icon={Layers}>
                  <select
                    id="quantityUnit"
                    name="quantityUnit"
                    required
                    value={formData.quantityUnit}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="" disabled>Select Unit</option>
                    <option value="per/piece">Per Piece</option>
                    <option value="per/kg">Per Kg</option>
                    <option value="per/set">Per Set</option>
                  </select>
                </InputWrapper>
                <InputWrapper label="Min Qty" id="MinQuantity" icon={Layers}>
                  <FormInput
                    type="number"
                    id="MinQuantity"
                    name="MinQuantity"
                    required
                    value={formData.MinQuantity}
                    onChange={handleChange}
                  />
                </InputWrapper>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                  <Maximize size={16} /> Size & Custom Pricing
                </h3>
                {formData.sizes.map((item, index) => (
                  <div key={index} className="flex gap-4 items-end animate-in fade-in slide-in-from-left-2 duration-300">
                    <div className="flex-1">
                      <FormInput
                        placeholder="Size (e.g. 10cm or Large)"
                        value={item.size}
                        onChange={(e) => {
                          const updated = [...formData.sizes];
                          updated[index].size = e.target.value;
                          setFormData({ ...formData, sizes: updated });
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <FormInput
                        type="number"
                        placeholder="Price Override ($)"
                        value={item.price}
                        onChange={(e) => {
                          const updated = [...formData.sizes];
                          updated[index].price = e.target.value;
                          setFormData({ ...formData, sizes: updated });
                        }}
                      />
                    </div>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, sizes: formData.sizes.filter((_, i) => i !== index) });
                        }}
                        className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, sizes: [...formData.sizes, { size: "", price: "" }] })}
                  className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  <Plus size={16} /> Add Another Size
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100 flex items-start gap-4 mb-6">
                <HelpCircle className="text-indigo-500 mt-1 flex-shrink-0" size={20} />
                <p className="text-sm text-indigo-700 leading-relaxed font-medium">
                  Adding precise specifications helps customers find your product through filters.
                  Common keys include: <span className="font-bold">Color, Origin, Hardness, luster</span>.
                </p>
              </div>

              <div className="space-y-4">
                {specifications.map((spec, index) => (
                  <div key={index} className="flex items-center gap-4 animate-in fade-in duration-300">
                    <div className="flex-1">
                      <FormInput
                        placeholder="Spec Name (e.g. Origin)"
                        value={spec.key}
                        onChange={(e) => {
                          const updated = [...specifications];
                          updated[index].key = e.target.value;
                          setSpecifications(updated);
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <FormInput
                        placeholder="Value (e.g. Brazil)"
                        value={spec.value}
                        onChange={(e) => {
                          const updated = [...specifications];
                          updated[index].value = e.target.value;
                          setSpecifications(updated);
                        }}
                      />
                    </div>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => setSpecifications(specifications.filter((_, i) => i !== index))}
                        className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setSpecifications([...specifications, { key: "", value: "" }])}
                  className="flex items-center gap-2 text-sm font-bold text-indigo-600 transition-colors"
                >
                  <Plus size={16} /> New Specification
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                    <ImageIcon size={18} /> Main Product Image
                  </h3>
                  <div className="relative group">
                    <div className={cn(
                      "w-full aspect-square border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden",
                      mainImage ? "border-indigo-600 bg-indigo-50/10" : "border-zinc-200 hover:border-indigo-400 bg-zinc-50/50 hover:bg-indigo-50/10"
                    )}>
                      {mainImage ? (
                        <div className="relative w-full h-full group">
                          <img src={URL.createObjectURL(mainImage)} alt="Main" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setMainImage(null)}
                            className="absolute top-4 right-4 p-2 bg-zinc-900/80 text-white rounded-xl backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="text-center p-6">
                          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 border border-zinc-100">
                            <Upload className="text-indigo-600" size={24} />
                          </div>
                          <p className="text-sm font-bold text-zinc-900 mb-1">Upload Main Image</p>
                          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">JPG, PNG up to 5MB</p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => setMainImage(e.target.files[0])}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                    <Box size={18} /> Secondary Gallery
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {additionalImages.map((img, i) => (
                      <div key={i} className="aspect-square rounded-2xl border border-zinc-200 relative group overflow-hidden">
                        <img src={URL.createObjectURL(img)} alt={`Gall ${i}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setAdditionalImages(prev => prev.filter((_, idx) => idx !== i))}
                          className="absolute inset-0 bg-rose-600/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    ))}
                    {additionalImages.length < 5 && (
                      <div className="aspect-square border-2 border-dashed border-zinc-200 rounded-2xl flex flex-col items-center justify-center hover:border-indigo-400 hover:bg-indigo-50/10 transition-all cursor-pointer relative">
                        <Plus className="text-zinc-400" size={24} />
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => setAdditionalImages(prev => [...prev, ...Array.from(e.target.files)])}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-zinc-100">
                <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                  <Maximize size={18} /> Physical Dimensions (cm)
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {['length', 'width', 'height'].map((dim) => (
                    <InputWrapper label={dim} id={dim} key={dim}>
                      <FormInput
                        type="number"
                        id={dim}
                        name={dim}
                        step="0.1"
                        value={formData[dim]}
                        onChange={handleChange}
                      />
                    </InputWrapper>
                  ))}
                </div>
              </div>

              <InputWrapper label="Special Notes" id="specialNotes" icon={FileText}>
                <FormTextArea
                  id="specialNotes"
                  name="specialNotes"
                  value={formData.specialNotes}
                  onChange={handleChange}
                  placeholder="Fragility, handling instructions, or unique characteristics..."
                />
              </InputWrapper>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 flex items-center justify-between">
          <button
            type="button"
            onClick={step === 1 ? () => window.location.reload() : prevStep}
            className="px-6 py-2.5 text-sm font-bold text-zinc-600 hover:bg-zinc-50 rounded-xl transition-all flex items-center gap-2"
          >
            {step === 1 ? <X size={18} /> : <ArrowLeft size={18} />}
            {step === 1 ? "Cancel" : "Back"}
          </button>

          {step < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-8 py-2.5 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-all shadow-md flex items-center gap-2"
            >
              Continue <ArrowRight size={18} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className={cn(
                "px-10 py-2.5 bg-indigo-600 text-white font-bold rounded-xl transition-all shadow-lg flex items-center gap-2",
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700 hover:shadow-indigo-100"
              )}
            >
              {loading ? "Publishing..." : "Publish Product"}
              {!loading && <CheckCircle2 size={18} />}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddProduct;