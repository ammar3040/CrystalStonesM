const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  originalPrice: { type: Number, required: true },
  discountedPrice: { type: Number ,required: true},
  dollarPrice: { type: Number,required: true },
  benefits: { type: [String]  }, // Array of selected checkboxes
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
  additionalImages: [
    {
      url: String,
      public_id: String
    }
  ],
  bestproduct: { type: Boolean, default: false },
  quantityUnit:{type:String,require:true},
  MinQuantity:{type:String,require:true}
  ,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Product", productSchema);
