const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  // dollarPrice and originalPrice are deprecated in favor of sizes[].price
  benefits: { type: [String] }, // Array of selected checkboxes
  crystalType: { type: String, required: true },
  dimensions: {
    length: { type: Number },
    width: { type: Number },
    height: { type: Number }
  },
  specialNotes: { type: String },
  mainImage: {
    url: { type: String, required: true },
    public_id: { type: String, required: true }
  },
  specifications: [
    {
      key: String,
      value: String
    }
  ],

  additionalImages: [
    {
      url: String,
      public_id: String
    }
  ],
  bestproduct: { type: Boolean, default: false },
  quantityUnit: { type: String, require: true },
  modelNumber: { type: String, require: true },
  MinQuantity: { type: String, require: true },
  //sizes of product
  sizes: [
    {
      size: { type: String }, // e.g., S, M, L, XL
      price: { type: Number },
    }
  ],
  is_deleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Add indexes for optimization
productSchema.index({ category: 1 });
productSchema.index({ crystalType: 1 });
productSchema.index({ bestproduct: 1 });
productSchema.index({ is_deleted: 1 });
productSchema.index({ modelNumber: 1 });
productSchema.index({ productName: "text", description: "text" });

module.exports = mongoose.model("Product", productSchema);
