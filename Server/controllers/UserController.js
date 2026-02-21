
const Product = require('../models/ProductModel');
const UserModel = require("../models/UserModel")
const SECRET_KEY = process.env.SECRET_KEY || 'fallback_dev_key_only';
const bcrypt = require('bcrypt');
const CatagoryModel = require('../models/CatagoryModel');
const CartModel = require('../models/CartModel');
const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/../.env` });
const axios = require("axios");
const InquiryModel = require('../models/InquiryModel'); // Adjust the path as needed
const OtpModel = require('../models/OtpModel');

const jwt = require('jsonwebtoken');
module.exports.ShowAllProduct = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      category,
      crystalType,
      bestproduct,
      minPrice,
      maxPrice,
      minDollarPrice,
      maxDollarPrice
    } = req.query;

    const parsedLimit = parseInt(limit);
    let query = {};

    // Keyword Search
    if (search) {
      query.$or = [
        { productName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { modelNumber: { $regex: search, $options: "i" } }
      ];
    }

    // Specific Filters
    if (category) query.category = category;
    if (crystalType) query.crystalType = crystalType;
    if (bestproduct !== undefined) query.bestproduct = bestproduct === 'true';

    // Price Range Filters (based on sizes array)
    if (minPrice || maxPrice || minDollarPrice || maxDollarPrice) {
      const min = minPrice || minDollarPrice;
      const max = maxPrice || maxDollarPrice;

      query["sizes.price"] = {};
      if (min) query["sizes.price"].$gte = parseFloat(min);
      if (max) query["sizes.price"].$lte = parseFloat(max);
    }

    const totalCount = await Product.countDocuments(query);

    // Use aggregation with $sample for shuffling.
    // Note: $sample is random, traditional skip/limit pagination is less effective with it,
    // but it provides the variety the user requested.
    const products = await Product.aggregate([
      { $match: query },
      { $sample: { size: parsedLimit } },
      {
        $project: {
          productName: 1,
          mainImage: 1,
          description: 1,
          MinQuantity: 1,
          modelNumber: 1,
          sizes: 1,
          category: 1,
          crystalType: 1,
          createdAt: 1
        }
      }
    ]);

    const responseData = {
      success: true,
      products: products || [],
      totalCount: totalCount || 0,
      currentPage: parseInt(page),
      totalPages: Math.ceil((totalCount || 0) / parsedLimit),
      isShuffled: true
    };

    res.json(responseData);
  } catch (error) {
    console.error("Error fetching shuffled products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
module.exports.ShowProduct = async (req, res) => {
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
    if (!Uname || !email || !password || !confirmPassword || !mobile) {
      return res.status(400).json({ success: false, message: "Required fields are missing" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    // Check for existing user by email or mobile
    const existingUser = await UserModel.findOne({ $or: [{ email }, { mobile }] });

    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already registered with this email or mobile" });
    }

    /* 
    // OTP verification flow (Disabled as per request)
    const otp = Math.floor(1000 + Math.random() * 9000);
    try {
      await axios.post(
        "https://www.fast2sms.com/dev/bulkV2",
        {
          route: "otp",
          variables_values: String(otp),
          numbers: mobile
        },
        {
          headers: {
            authorization: process.env.FAST2SMS_API_KEY,
            "Content-Type": "application/json"
          }
        }
      );
      await OtpModel.deleteMany({ phone: mobile });
      const otpRecord = new OtpModel({ phone: mobile, otp });
      await otpRecord.save();
      return res.status(200).json({ 
        success: true, 
        message: "OTP sent to your mobile. Please verify to complete registration.",
        tempData: { Uname, email, mobile, address, password } 
      });
    } catch (smsError) {
      console.error("SMS error during signup:", smsError.response?.data || smsError.message);
      return res.status(500).json({ success: false, message: "Failed to send verification OTP" });
    }
    */

    // Directly create and save the user
    const newUser = new UserModel({
      Uname: Uname.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      address: address?.trim(),
      password: password, // Plain text as requested
    });

    await newUser.save();

    // Generate JWT token so they are logged in immediately
    const token = jwt.sign(
      { uid: newUser._id, name: newUser.Uname, email: newUser.email, role: newUser.role },
      process.env.SECRET_KEY,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        uid: newUser._id,
        name: newUser.Uname,
        email: newUser.email,
        mobile: newUser.mobile,
        role: newUser.role
      }
    });

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

  // Generate JWT token
  const token = jwt.sign(
    { uid: user._id, name: user.Uname, email: user.email, role: user.role },
    SECRET_KEY,
    { expiresIn: '7d' }
  );

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
      token,
      redirect: `${process.env.ADMIN_LINK}`,
    });
  } else {

    return res.json({
      success: true,
      role: 'user',
      token,
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
module.exports.getCatagory = async (req, res) => {
  try {
    const allCatagoryData = await CatagoryModel.find();
    return res.json(allCatagoryData);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports.ShowCatagoryProducts = async (req, res) => {
  try {
    const {
      catagoryName,
      page = 1,
      limit = 10,
      search = "",
      crystalType,
      bestproduct,
      minPrice,
      maxPrice,
      minDollarPrice,
      maxDollarPrice,
      sortBy = "createdAt",   // createdAt, originalPrice, dollarPrice, productName
      sortOrder = "desc"      // asc or desc
    } = req.query;

    if (!catagoryName) {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Base query — category is mandatory
    let query = { category: catagoryName };

    // Keyword Search within the category
    if (search) {
      query.$or = [
        { productName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { modelNumber: { $regex: search, $options: "i" } }
      ];
    }

    // Additional Filters
    if (crystalType) query.crystalType = crystalType;
    if (bestproduct !== undefined) query.bestproduct = bestproduct === 'true';

    // Price Range Filters (based on sizes array)
    if (minPrice || maxPrice || minDollarPrice || maxDollarPrice) {
      const min = minPrice || minDollarPrice;
      const max = maxPrice || maxDollarPrice;

      query["sizes.price"] = {};
      if (min) query["sizes.price"].$gte = parseFloat(min);
      if (max) query["sizes.price"].$lte = parseFloat(max);
    }

    // Sorting - Note: sorting by nested price is complex in Mongo, 
    // usually we'd sort by the first element's price.
    const sortOptions = {};
    if (sortBy === "originalPrice" || sortBy === "dollarPrice" || sortBy === "price") {
      sortOptions["sizes.0.price"] = sortOrder === "asc" ? 1 : -1;
    } else {
      sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;
    }

    const totalCount = await Product.countDocuments(query);
    const products = await Product.find(query)
      .select('productName mainImage description MinQuantity modelNumber sizes category crystalType')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      products: products || [],
      totalCount: totalCount || 0,
      currentPage: parseInt(page),
      totalPages: Math.ceil((totalCount || 0) / parseInt(limit)),
      category: catagoryName
    });
  } catch (error) {
    console.error("Error fetching category products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports.setBestProductList = async (req, res) => {
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
module.exports.getBestProductList = async (req, res) => {
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
        variables_values: String(otp), // ✅ only numeric value
        numbers: phone // no need to parseInt unless your number is numeric only
      },
      {
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );


    // Save OTP to DB
    await OtpModel.deleteMany({ phone: phone });
    const otpRecord = new OtpModel({ phone, otp });
    await otpRecord.save();

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
  const { phone, otp, registrationData } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ success: false, message: "Phone number and OTP are required" });
  }

  const otpRecord = await OtpModel.findOne({ phone, otp });

  if (otpRecord) {
    await OtpModel.deleteMany({ phone }); // ✅ Clear OTP after verification

    try {
      // Check if user already exists
      let user = await UserModel.findOne({ mobile: phone });

      if (user) {
        // If it was a signup attempt for an existing user
        if (registrationData) {
          return res.status(409).json({ success: false, message: "User already exists with this mobile number." });
        }

        const userData = {
          uid: user._id,
          name: user.Uname,
          email: user.email,
          mobile: user.mobile,
          address: user.address,
          role: user.role
        };

        // Generate JWT token
        const token = jwt.sign(
          { uid: user._id, name: user.Uname, email: user.email, role: user.role },
          SECRET_KEY,
          { expiresIn: '7d' }
        );

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
          token,
          message: "✅ OTP verified successfully",
          user: userData
        });
      }

      // If user doesn't exist AND we have registration data, create the user
      if (registrationData) {
        const { Uname, email, address, password } = registrationData;
        user = new UserModel({
          Uname: Uname?.trim(),
          email: email?.trim(),
          mobile: phone,
          address: address?.trim(),
          password: password, // Plain text as requested
        });
        await user.save();
      } else {
        // Fallback for phone-only login/signup if no details provided
        user = new UserModel({ mobile: phone });
        await user.save();
      }

      const token = jwt.sign(
        { uid: user._id, name: user.Uname, mobile: user.mobile, role: user.role },
        SECRET_KEY,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        success: true,
        isNewUser: true,
        token,
        message: "✅ OTP verified and user registration completed",
        user: {
          uid: user._id,
          name: user.Uname,
          mobile: user.mobile
        }
      });

    } catch (error) {
      console.error("Error during verification/creation:", error);
      return res.status(500).json({
        success: false,
        message: "Something went wrong, please try again.",
        debug: error.message
      });
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
    return res.redirect(`${process.env.GOOGLE_ADMIN_AUTH}`);
  } else {
    return res.redirect(`${process.env.FRONTEND_LINK}/`);
  }
};


// add to cart 


module.exports.getCartItem = async (req, res) => {
  const { pid, uid, selectedSize, price } = req.body;
  let quantity = req.body.quantity || 1;

  if (!pid || !uid) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    // Check if cart item already exists with same product and size
    let existingCartItem = await CartModel.findOne({
      userId: uid,
      productId: pid,
      selectedSize: selectedSize || null
    });

    if (existingCartItem) {
      existingCartItem.quantity += 1;
      await existingCartItem.save();
    } else {
      const newCartItem = new CartModel({
        userId: uid,
        productId: pid,
        quantity,
        selectedSize: selectedSize || null,
        price: price || 0
      });
      await newCartItem.save();
    }

    res.status(200).json({ success: true, message: "Item added to cart" });
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


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
module.exports.deleteCartItem = async (req, res) => {
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
  try {
    const { uid, contactPhone, message, address, products } = req.body;

    if (!uid || !products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: user ID or products."
      });
    }

    // Step 1: Find user
    const user = await UserModel.findById(uid).lean();
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Step 2: Check if user has email or contactPhone
    if ((!user.email || user.email.trim() === '') && (!contactPhone || contactPhone.trim() === '')) {
      return res.status(400).json({
        success: false,
        message: "User must have an email or contact phone to submit inquiry."
      });
    }

    // Step 3: Create inquiry





    const inquiry = new InquiryModel({
      userId: uid,
      message,
      products,
      address,
      contactPhone: contactPhone || user.contactPhone || ''  // fallback if needed
    });

    await inquiry.save();

    return res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully.",
      inquiry
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error."
    });
  }
};


// clear cart after inquery 

module.exports.clearCart = async (req, res) => {
  try {
    const { uid } = req.body;

    if (!uid) {
      return res.status(400).json({ message: "UID required" });
    }

    await CartModel.deleteMany({ userId: uid });

    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (err) {
    console.error("Error clearing cart:", err);
    res.status(500).json({ message: "Server error while clearing cart" });
  }
}
module.exports.getUserInquiries = async (req, res) => {
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
module.exports.getAllInquiries = async (req, res) => {
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

module.exports.updateInquiryStatus = async (req, res) => {
  try {
    console.log("status :" + req.body.status)
    console.log("id :" + req.params.id)
    const { status } = req.body;
    await InquiryModel.findByIdAndUpdate(req.params.id, { status });
    res.json({ message: "Status updated successfully" });
  } catch (err) {
    console.error("Failed to update status:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}



// subscribe by email
module.exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    // 2. Check if user exists
    let user = await UserModel.findOne({ email });

    if (user) {
      // 3. If user exists, update subscription flag
      if (user.isSubscribed) {
        res.cookie('subscribed', 'true', {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 30,
          sameSite: 'Lax',
        });
        return res.status(200).json({ success: true, message: 'Already subscribed' });
      }

      user.isSubscribed = true;
      await user.save();
    } else {
      // 4. If user doesn't exist, create minimal user with subscription
      user = new UserModel({ email, isSubscribed: true });
      await user.save();
    }

    // 5. Set cookie
    res.cookie('subscribed', 'true', {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      sameSite: 'Lax',
    });

    return res.status(200).json({ success: true, message: 'Subscribed successfully' });
  } catch (err) {
    console.error('Subscribe error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// get specification 
module.exports.specific = async (req, res) => {
  const { category } = req.query;

  try {
    const product = await Product.findOne({ category }).sort({ createdAt: -1 });
    if (product) {
      return res.status(200).json({ specifications: product.specifications || [] });
    }
    res.status(404).json({ message: "No product found for this category" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// complete profile details
module.exports.completeProfile = async (req, res) => {
  const { uid, address, mobile, password } = req.body;

  try {
    const updateFields = { address, mobile };
    if (password) {
      updateFields.password = password;
    }

    await UserModel.findOneAndUpdate({ uid }, updateFields);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to update profile");
  }
}

// Update cart item quantity (increment/decrement)
module.exports.updateCartItem = async (req, res) => {
  try {
    const { cartId, action } = req.body;
    const userId = req.user.uid;

    if (!cartId || !action) {
      return res.status(400).json({ success: false, message: 'Cart ID and action (increment/decrement) are required' });
    }

    if (!['increment', 'decrement'].includes(action)) {
      return res.status(400).json({ success: false, message: 'Action must be "increment" or "decrement"' });
    }

    const cartItem = await CartModel.findOne({ _id: cartId, userId: userId });

    if (!cartItem) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    if (action === 'increment') {
      cartItem.quantity += 1;
      await cartItem.save();
      return res.status(200).json({ success: true, message: 'Quantity increased', cartItem });
    }

    if (action === 'decrement') {
      if (cartItem.quantity <= 1) {
        // Remove item if quantity becomes 0
        await CartModel.findByIdAndDelete(cartId);
        return res.status(200).json({ success: true, message: 'Item removed from cart', removed: true });
      }
      cartItem.quantity -= 1;
      await cartItem.save();
      return res.status(200).json({ success: true, message: 'Quantity decreased', cartItem });
    }
  } catch (err) {
    console.error('Error updating cart:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};