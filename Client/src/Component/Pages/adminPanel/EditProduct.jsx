import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const EditProduct = () => {
  const { pid } = useParams();
  const navigate = useNavigate();
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
  });

  const [mainImage, setMainImage] = useState(null);
  const [existingMainImageUrl, setExistingMainImageUrl] = useState("");
  const [additionalImages, setAdditionalImages] = useState([]);
  const [existingAdditionalImages, setExistingAdditionalImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removedAdditionalImages, setRemovedAdditionalImages] = useState([]);

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
            length: product.length || "",
            width: product.width || "",
            height: product.height || "",
          });
          setExistingMainImageUrl(product.mainImage?.url || "");
          setExistingAdditionalImages(product.additionalImages || []);
          setCategories(res.data.categories || []);
        } else {
          toast.error("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        toast.error("Error loading product");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [pid]);

  const handleChange = (e) => {
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
    }
  };

  const handleRemoveAdditionalImage = (index) => {
    const imageToRemove = existingAdditionalImages[index];
    setRemovedAdditionalImages(prev => [...prev, imageToRemove.public_id]);
    setExistingAdditionalImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const form = new FormData();

    // Append all form data
    Object.keys(formData).forEach((key) => {
      if (key === "benefits") {
        formData.benefits.forEach((b) => form.append("benefits", b));
      } else {
        form.append(key, formData[key]);
      }
    });

    // Append product ID
    form.append("id", pid); // ✅ backend expects 'id'


    // Append main image if changed
    if (mainImage) {
      form.append("mainImage", mainImage);
    }

    // Append new additional images
    additionalImages.forEach((img) => {
      form.append("additionalImages", img);
    });

    // Append removed additional images
    removedAdditionalImages.forEach((publicId) => {
      form.append("removedAdditionalImages", publicId);
    });

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/updateData`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

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
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 h-screen overflow-auto">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Edit Crystal Product
        </h2>
        <p className="text-center text-gray-500 mb-4">Update the details of your product below.</p>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Model Number */}
              <div className="relative">
                <input
                  type="text"
                  id="modelNumber"
                  name="modelNumber"
                  required
                  value={formData.modelNumber}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 text-sm text-gray-900 bg-white rounded-lg border border-gray-200 appearance-none focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black peer"
                  placeholder=" "
                />
                <label 
                  htmlFor="modelNumber"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Model Number
                </label>
              </div>

              {/* Product Name */}
              <div className="relative">
                <input
                  type="text"
                  id="productName"
                  name="productName"
                  required
                  value={formData.productName}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 text-sm text-gray-900 bg-white rounded-lg border border-gray-200 appearance-none focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black peer"
                  placeholder=" "
                />
                <label 
                  htmlFor="productName"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Product Name
                </label>
              </div>

              {/* Product Description */}
              <div className="relative">
                <textarea
                  id="description"
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="block w-full px-4 py-3 text-sm text-gray-900 bg-white rounded-lg border border-gray-200 appearance-none focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black peer"
                  placeholder=" "
                />
                <label 
                  htmlFor="description"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Product Description
                </label>
              </div>

              {/* Category */}
              <div className="relative">
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 text-sm text-gray-900 bg-white rounded-lg border border-gray-200 appearance-none focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black peer"
                >
                  <option value="" disabled></option>
                  {categories.map((category) => (
                    <option key={category._id} value={category.category}>
                      {category.category}
                    </option>
                  ))}
                </select>
                <label 
                  htmlFor="category"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Product Category
                </label>
              </div>

              {/* Astrological Benefits */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Astrological Benefits
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["wealth", "happiness", "protection", "health", "love", "success", "peace"].map(
                    (benefit) => (
                      <label key={benefit} className="flex items-center space-x-2 cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            name="benefits"
                            value={benefit}
                            checked={formData.benefits.includes(benefit)}
                            onChange={handleChange}
                            className="absolute opacity-0 h-0 w-0"
                          />
                          <div className={`w-5 h-5 border-2 rounded-md flex items-center justify-center 
                            ${formData.benefits.includes(benefit) ? 'bg-black border-black' : 'border-gray-300'}`}>
                            {formData.benefits.includes(benefit) && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <span className="text-gray-700 capitalize">{benefit}</span>
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* Crystal Type */}
              <div className="relative">
                <input
                  type="text"
                  id="crystalType"
                  name="crystalType"
                  required
                  value={formData.crystalType}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 text-sm text-gray-900 bg-white rounded-lg border border-gray-200 appearance-none focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black peer"
                  placeholder=" "
                />
                <label 
                  htmlFor="crystalType"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Crystal Type
                </label>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Original Price */}
              <div className="relative">
                <input
                  type="number"
                  id="originalPrice"
                  name="originalPrice"
                  step="0.01"
                  required
                  value={formData.originalPrice}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 text-sm text-gray-900 bg-white rounded-lg border border-gray-200 appearance-none focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black peer"
                  placeholder=" "
                />
                <label 
                  htmlFor="originalPrice"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Original Price (₹)
                </label>
              </div>

              {/* Discounted Price */}
              <div className="relative">
                <input
                  type="number"
                  id="discountedPrice"
                  name="discountedPrice"
                  step="0.01"
                  value={formData.discountedPrice}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 text-sm text-gray-900 bg-white rounded-lg border border-gray-200 appearance-none focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black peer"
                  placeholder=" "
                />
                <label 
                  htmlFor="discountedPrice"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Discounted Price (₹)
                </label>
              </div>

              {/* Dollar Price */}
              <div className="relative">
                <input
                  type="number"
                  id="dollarPrice"
                  name="dollarPrice"
                  step="0.01"
                  value={formData.dollarPrice}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 text-sm text-gray-900 bg-white rounded-lg border border-gray-200 appearance-none focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black peer"
                  placeholder=" "
                />
                <label 
                  htmlFor="dollarPrice"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Price ($)
                </label>
              </div>

              {/* Quantity Unit */}
              <div className="relative">
                <select
                  id="quantityUnit"
                  name="quantityUnit"
                  required
                  value={formData.quantityUnit}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 text-sm text-gray-900 bg-white rounded-lg border border-gray-200 appearance-none focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black peer"
                >
                  <option value="" disabled></option>
                  <option value="per/piece">Per Piece</option>
                  <option value="per/kg">Per Kg</option>
                  <option value="per/set">Per Set</option>
                </select>
                <label 
                  htmlFor="quantityUnit"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Quantity Unit
                </label>
              </div>

              {/* Minimum Quantity */}
              <div className="relative">
                <select
                  id="MinQuantity"
                  name="MinQuantity"
                  required
                  value={formData.MinQuantity}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 text-sm text-gray-900 bg-white rounded-lg border border-gray-200 appearance-none focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black peer"
                >
                  <option value="" disabled></option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="5">5</option>
                 <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                  <option value="25">25</option>
                  <option value="30">30</option>
                  <option value="35">35</option>
                </select>
                <label 
                  htmlFor="MinQuantity"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Minimum Quantity
                </label>
              </div>

              {/* Main Product Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Product Image
                </label>
                <div className="flex items-center">
                  <label className="flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="mt-2 text-sm text-gray-600">Click to upload</span>
                    <input 
                      type="file" 
                      name="mainImage" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => setMainImage(e.target.files[0])} 
                    />
                  </label>
                  <div className="ml-4 flex items-center gap-4">
                    {mainImage ? (
                      <img
                        src={URL.createObjectURL(mainImage)}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                      />
                    ) : existingMainImageUrl ? (
                      <img
                        src={existingMainImageUrl}
                        alt="Current"
                        className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                      />
                    ) : null}
                    <span className="text-sm text-gray-500">
                      {mainImage ? mainImage.name : "No file chosen"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Additional Product Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Product Images
                </label>
                <div className="flex items-center">
                  <label className="flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="mt-2 text-sm text-gray-600">Click to upload</span>
                    <input
                      type="file"
                      name="additionalImages"
                      accept="image/*"
                      className="hidden"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files);
                        setAdditionalImages((prev) => [...prev, ...files]);
                      }}
                    />
                  </label>
                  <span className="ml-4 text-sm text-gray-500">
                    {additionalImages.length > 0 
                      ? `${additionalImages.length} new files selected` 
                      : "No new files chosen"}
                  </span>
                </div>
                
                {/* Existing additional images */}
                {existingAdditionalImages.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">Existing Images (click to remove)</p>
                    <div className="grid grid-cols-3 gap-2">
                      {existingAdditionalImages.map((img, index) => (
                        <div key={index} className="relative">
                          <img
                            src={img.url}
                            alt={`Product ${index}`}
                            className="w-24 h-24 object-cover rounded border cursor-pointer"
                            onClick={() => handleRemoveAdditionalImage(index)}
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black bg-opacity-50 transition-opacity">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New additional images preview */}
                {additionalImages.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">New Images to be added</p>
                    <div className="grid grid-cols-3 gap-2">
                      {additionalImages.map((file, index) => (
                        <img
                          key={index}
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index}`}
                          className="w-24 h-24 object-cover rounded border"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Product Dimensions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Product Dimensions (cm)
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {['length', 'width', 'height'].map((dimension) => (
                    <div className="relative" key={dimension}>
                      <input
                        type="number"
                        id={dimension}
                        name={dimension}
                        step="0.1"
                        value={formData[dimension]}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 text-sm text-gray-900 bg-white rounded-lg border border-gray-200 appearance-none focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black peer text-center"
                        placeholder=" "
                      />
                      <label 
                        htmlFor={dimension}
                        className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1/2 -translate-x-1/2"
                      >
                        {dimension}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Special Notes */}
          <div className="mt-8">
            <div className="relative">
              <textarea
                id="specialNotes"
                name="specialNotes"
                value={formData.specialNotes}
                onChange={handleChange}
                rows="3"
                className="block w-full px-4 py-3 text-sm text-gray-900 bg-white rounded-lg border border-gray-200 appearance-none focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black peer"
                placeholder=" "
              />
              <label 
                htmlFor="specialNotes"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
              >
                Special Notes
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/admin-a9xK72rQ1m8vZpL0/view-products")}
              className="px-6 py-2.5 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 text-sm font-medium text-white bg-black rounded-lg hover:bg-black disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isLoading ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;