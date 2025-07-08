import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AddProduct = () => {
  
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
  const [additionalImages, setAdditionalImages] = useState([]);
  const [catagorys, setCatagorys] = useState([]);

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
// atching all catagory

  useEffect(() => {
    const fetchCatagorys = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/getCatagory`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setCatagorys(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCatagorys(); // <-- make sure to call it
  }, []);




const handleSubmit = async (e) => {
  e.preventDefault();

  const form = new FormData();

  // Append basic fields
  Object.keys(formData).forEach((key) => {
    if (key === 'benefits') {
      formData.benefits.forEach((b) => form.append('benefits', b));
    } else {
      form.append(key, formData[key]);
    }
  });

  // Append files
  if (mainImage) {
    form.append('mainImage', mainImage);
  }

  additionalImages.forEach((img) => {
    form.append('additionalImages', img);
  });

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/AddProduct`, {
      method: 'POST',
      body: form,
    });

    if (response.ok) {
      toast.success("Product added successfully!");
      window.location.reload(); // Or redirect user
    } else {
      toast.error("Failed to add product.");
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    toast.error("Something went wrong.");
  }
};


  return (
    <div className="container mx-auto p-4 h-screen overflow-auto">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Add New Crystal Product
        </h2>
        
        <form onSubmit={handleSubmit} encType="multipart/form-data">
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
                  {catagorys.map((catagory) => ( <option value={catagory.category}>{catagory.category}</option>))}
                 
          
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
  {mainImage && (
    <img
      src={URL.createObjectURL(mainImage)}
      alt="Preview"
      className="w-20 h-20 object-cover rounded-lg border border-gray-300"
    />
  )}
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
  multiple // ✅ allows multi-select
  onChange={(e) => {
    const files = Array.from(e.target.files);
    setAdditionalImages((prev) => [...prev, ...files]);

  }}
/>

                  </label>
                  <span className="ml-4 text-sm text-gray-500">
                    {additionalImages.length > 0 
                      ? `${additionalImages.length} files selected` 
                      : "No files chosen"}
                  </span>
                </div>
                {additionalImages.length > 0 && (
  <div className="mt-4 grid grid-cols-3 gap-2">
    {additionalImages.map((file, index) => (
      <img
        key={index}
        src={URL.createObjectURL(file)}
        alt={`Preview ${index}`}
        className="w-24 h-24 object-cover rounded border"
      />
    ))}
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

          {/* Buttons */}
          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 text-sm font-medium text-black bg-white border border-violet-300 rounded-lg hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-violet-200"
            >
              Reset Form
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-medium text-white bg-black rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-violet-300"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;