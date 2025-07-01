const mongoose = require("mongoose");

const CatagorySchema= new mongoose.Schema({
  category: { type: String, required: true },
  mainImage: {
    url: { type: String, required: true },
    public_id: { type: String, required: true }
  }
  ,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Catagory", CatagorySchema);
