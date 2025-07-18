const mongoose = require("mongoose");

const InquirySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1
      },
      selectedSize: {
        type: String,
        
      },
      price: {
        type: Number,
        required: true
      }
    }
  ],
  message: {
    type: String,
    trim: true,
    default: ""
  },
  contactPhone: {
    type: String,
    trim: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }, 
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    country: { type: String, trim: true }
  },
  status: {
    type: String,
    enum: ["pending", "replied"],
    default: "pending"
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Inquiry", InquirySchema);
