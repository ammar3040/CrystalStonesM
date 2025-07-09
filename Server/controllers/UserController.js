
const Product = require('../models/ProductModel'); 
const UserModel=require("../models/UserModel")
const SECRET_KEY = process.env.SECRET_KEY || 'fallback_dev_key_only';
const bcrypt = require('bcrypt');
const CatagoryModel = require('../models/CatagoryModel');
const CartModel = require('../models/CartModel');
const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/../.env` }); 
const axios = require("axios");
const InquiryModel = require('../models/InquiryModel'); // Adjust the path as needed

const otpStore = new Map();
const jwt = require('jsonwebtoken');
 module.exports.ShowAllProduct = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
module.exports.ShowProduct= async (req, res) => {
  try {
    const productId = req.query.id;
   
    
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
module.exports.SignUp = async (req, res) => {
  try {
    const { Uname, email, mobile, address, password, confirmPassword } = req.body;

    // Basic validation
    if (!Uname || !email || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: "Required fields are missing" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    const existingUser = await UserModel.findOne({ mobile });

    if (!existingUser) {
      return res.status(404).json({ success: false, message: "Mobile number not verified yet. Please verify OTP first." });
    }

    if (existingUser.email) {
      return res.status(409).json({ success: false, message: "User already registered with this mobile number" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await UserModel.findOneAndUpdate(
      { mobile },
      {
        $set: {
          Uname: Uname.trim(),
          email: email.trim(),
          address: address?.trim() || undefined,
          password: hashedPassword,
          // isVerified: true // Optional: use if you want a verification flag
        },
      },
      { new: true }
    );

    return res.status(200).json({ success: true, message: "User registered successfully", user: updatedUser });

  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Registration failed. Please try again.",
      error: error.message
    });
  }
};
module.exports.SignIn = (req, res) => {
  const user = req.user;
 
  // Set cookie with user data (JSON string)
  res.cookie('user', JSON.stringify({
    uid: user._id,
    name: user.Uname,
    email: user.email,
    mobile: user.mobile,
    address: user.address,
    role: user.role
  }), {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: false,
    secure: true,
    sameSite: 'none'
  });

  if (user.role === 'admin') {
    return res.json({
      success: true,
      role: 'admin',
      redirect:`${process.env.ADMIN_LINK}`,
    });
  } else {
   
    return res.json({
      success: true,
      role: 'user',
      user: {
        id: user._id,
        name: user.Uname,
        email: user.email,
        mobile: user.mobile,
        address: user.address,
        role: user.role
      }
    });
  }
};



// for sending otp


// get catagory
module.exports.getCatagory=async (req, res) => {
  try {
    const allCatagoryData = await CatagoryModel.find();
    return res.json(allCatagoryData);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports.ShowCatagoryProducts=async (req, res) => {
  try {
    const catagoryName = req.query.catagoryName;
 
 
    const allCatagoryProducts = await Product.find({ category: catagoryName });

    res.json(allCatagoryProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports.setBestProductList= async (req, res) => {
  const selectedIds = req.body.bestProducts; // could be array or single string

  try {
    // First, reset all to false
    await Product.updateMany({}, { $set: { bestproduct: false } });

    // Then, set selected to true
    if (selectedIds) {
      const idsArray = Array.isArray(selectedIds) ? selectedIds : [selectedIds];
      await Product.updateMany(
        { _id: { $in: idsArray } },
        { $set: { bestproduct: true } }
      );
    }
    console.log("produc tupdatedfrom here ")

    res.status(200).json({ success: true, message: 'Best products updated successfully!' });
 // or wherever you want
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}
module.exports.getBestProductList= async (req, res) => {
  try {
    const bestProducts = await Product.find({ bestproduct: true });
    res.json(bestProducts);
  } catch (error) {
    console.error("Error fetching best products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
module.exports.sendOtp = async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ success: false, message: "Phone number required" });
  }

  const otp = Math.floor(1000 + Math.random() * 9000); // 🔢 4-digit OTP

  try {
 const response = await axios.post(
  "https://www.fast2sms.com/dev/bulkV2",
  {
    route: "otp", // or use process.env.FAST2SMS_ROUTE if it's correctly set
    variables_values: otp, // ✅ only numeric value
    numbers: phone // no need to parseInt unless your number is numeric only
  },
  {
    headers: {
      authorization: process.env.FAST2SMS_API_KEY,
      "Content-Type": "application/json"
    }
  }
);


    otpStore.set(phone, otp); // ✅ Store OTP after sending

    res.json({ success: true, message: "OTP sent", otp }); // ⚠️ Don't send OTP in production
  } catch (error) {
    console.error("SMS sending error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.response?.data || error.message
    });
  }
};

// verfication of otp
// adjust path if needed

module.exports.verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ success: false, message: "Phone number and OTP are required" });
  }

  const savedOtp = otpStore.get(phone);

  if (savedOtp && String(savedOtp).trim() === String(otp).trim()) {
    otpStore.delete(phone); // ✅ Clear OTP after verification

    try {
      // Check if user already exists
      const existingUser = await UserModel.findOne({ mobile: phone });

      if (existingUser) {
        const userData = {
          uid: existingUser._id,
          name: existingUser.Uname,
          email: existingUser.email,
          mobile: existingUser.mobile,
          address: existingUser.address,
          role: existingUser.role
        };

        // ✅ Set cookie for the existing user
        res.cookie('user', JSON.stringify(userData), {
          maxAge: 24 * 60 * 60 * 1000, // 1 day
          httpOnly: false,
          secure: true,
          sameSite: 'none'
        });

       return res.status(200).json({
  success: true,
  isNewUser: false,
  message: "✅ OTP verified, user already exists",
  user: userData
});

      }

      // Create a new user with phone number
      const newUser = new UserModel({ mobile: phone });
      await newUser.save();

      return res.status(201).json({
  success: true,
  isNewUser: true,
  message: "✅ OTP verified and user created",
  user: {
    uid: newUser._id,
    name: newUser.Uname,
    email: newUser.email,
    mobile: newUser.mobile,
    address: newUser.address,
    role: newUser.role
  }
});


   } catch (error) {
  console.error("Error during user creation:", error);
 return res.status(500).json({
  success: false,
  message: "Something went wrong, please try again.",
  debug: error.message  // Send this only in dev
});
;
}


  } else {
    return res.status(400).json({ success: false, message: "❌ Invalid or expired OTP" });
  }
};


// goggle authentication 


module.exports.GoogleSignIn = (req, res) => {
  const user = req.user;

  res.cookie('user', JSON.stringify({
    uid: user._id,
    name: user.Uname,
    email: user.email,
    mobile: user.mobile,
    address: user.address,
    role: user.role
  }), {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: false,
    secure: true,
    sameSite: 'none'
  });

  if (user.role === 'admin') {
    return res.redirect(`${process.env.BACKEND_LINK}/admin`);
  } else {
    return res.redirect(`${process.env.FRONTEND_LINK }/`);
  }
};


// add to cart 


module.exports.getCartItem = async (req, res) => {
  const { pid, uid } = req.body;
  let quantity = req.body.quantity || 1;

  if (!pid || !uid) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    let existingCartItem = await CartModel.findOne({
      userId: uid,
      productId: pid
    });

    if (existingCartItem) {
      // ✅ Correctly increase quantity and save
      existingCartItem.quantity += 1;
      await existingCartItem.save();
    } else {
      const newCartItem = new CartModel({
        userId: uid,
        productId: pid,
        quantity
      });
      await newCartItem.save();
    }

    res.status(200).json({ success: true, message: "Item added to cart" });
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}


// show perticular user carted item
module.exports.getCartedItem = async (req, res) => {
  const userId = req.body.uid;

  if (!userId) {
    return res.status(400).json({ success: false, message: "User ID is required" });
  }

  try {
    const cartItems = await CartModel.find({ userId }).populate('productId');
    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

// delete cart item
module.exports.deleteCartItem =async (req, res) => {
  const { cartId, uid } = req.body;

  try {
    const deleted = await CartModel.findOneAndDelete({
      _id: cartId,
      uid: uid,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// update mobile number wit h otp
module.exports.updatePhone = async (req, res) => {
  const { email, mobile } = req.body;


  try {
   const user = await UserModel.findByIdAndUpdate(
  email,  // here, 'email' is actually user ID if you're passing it like that
  { mobile: mobile },
  { new: true }
);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// submit inquiry from user


module.exports.submitInquiry = async (req, res) => {
  const { uid, products, message, contactPhone } = req.body;

  if (!uid || !products || products.length === 0) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    const inquiry = new InquiryModel({
      userId: uid,
      products,
      message,
      contactPhone
    });

    await inquiry.save();

    res.status(201).json({ success: true, message: "Inquiry submitted", inquiry });
  } catch (err) {
    console.error("Inquiry error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// clear cart after inquery 

module.exports.clearCart=async (req, res) => {
  try {
    const { uid } = req.body;

    if (!uid) {
      return res.status(400).json({ message: "UID required" });
    }

    await CartModel.deleteMany({ userId:uid });

    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (err) {
    console.error("Error clearing cart:", err);
    res.status(500).json({ message: "Server error while clearing cart" });
  }
}
module.exports.getUserInquiries= async (req, res) => {
  try {
    const { uid } = req.params;

    
    const inquiries = await InquiryModel.find({ userId: uid })
      .populate("products.productId")
      .sort({ submittedAt: -1 });
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch inquiries" });
  }
}
module.exports.getAllInquiries= async (req, res) => {
  try {
const inquiries = await InquiryModel.find() // or any filter
  .populate("userId", "Uname email mobile")
  .populate("products.productId", "productName mainImage modelNumber");

    res.status(200).json(inquiries);
  } catch (error) {
    console.error("Error fetching all inquiries:", error);
    res.status(500).json({ message: "Server error while fetching inquiries" });
  }
}
// change status of inquery

module.exports.updateInquiryStatus= async (req, res) => {
  try {
    console.log("status :"+req.body.status)
    console.log("id :"+req.params.id)
    const { status } = req.body;
    await InquiryModel.findByIdAndUpdate(req.params.id, { status });
    res.json({ message: "Status updated successfully" });
  } catch (err) {
    console.error("Failed to update status:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}