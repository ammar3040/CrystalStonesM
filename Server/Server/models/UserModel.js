const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  Uname: {
    type: String,
    trim: true
  },
  email: {
    type: String,
   require:false,
    unique: true,        // ✅ Prevent duplicate emails
    lowercase: true,     // ✅ Normalize
    trim: true
  },
  address: {
    type: String,
    default: ''
  },
  mobile: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    default: "user"
  },
  isSubscribed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("User", UserSchema);
