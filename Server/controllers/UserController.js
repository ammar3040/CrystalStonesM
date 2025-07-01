
const Product = require('../models/ProductModel'); 
const UserModel=require("../models/UserModel")
const SECRET_KEY = process.env.SECRET_KEY || 'fallback_dev_key_only';
const bcrypt = require('bcrypt');
const CatagoryModel = require('../models/CatagoryModel');

const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/../.env` }); 


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
module.exports.SignUp=async (req, res) => {
  try {
  
    
    const { Uname, email, mobile, address, password, confirmPassword } = req.body;

    // Basic validation
    if (!Uname || !email || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: "Required fields are missing" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new UserModel({
      Uname,
      email,
      mobile: mobile || undefined, // Only store if provided
      address: address || undefined, // Only store if provided
       password: hashedPassword // Note: In production, you should hash the password before saving
    });

    // Save to database
    const savedUser = await newUser.save();


    // Respond with success (excluding password in response)
    const userResponse = savedUser.toObject();
    delete userResponse.password;

    res.status(201).json({ 
      success: true, 
      message: "Registered successfully!",
      user: userResponse
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Registration failed or already Registrat",
      error: error.message 
    });
  }
}
module.exports.SignIn=async (req, res) => {
  try {
    const { email, password } = req.body;

  


    const user = await UserModel.findOne({
      email: { $regex: new RegExp(`^${email}$`, 'i') }
    });
     if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
const isPasswordMatch = await bcrypt.compare(password, user.password);


    if ( !isPasswordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    // Generate JWT token with all necessary user data
    const token = jwt.sign(
      { 
        id: user._id, 
        name: user.Uname, 
        email: user.email,
        mobile: user.mobile,
        address: user.address,
         role: user.role
      },
      SECRET_KEY,
      { expiresIn: '1d' }
    );

    // Set cookie with the token
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true in production
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    // Also set a user cookie with the basic info
    res.cookie('user', {
      name: user.Uname,
      email: user.email,
      mobile: user.mobile,
      address: user.address
    }, {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      httpOnly: false // So client-side can read it
    });

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.Uname,
        email: user.email,
        mobile: user.mobile,
        address: user.address,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// for sending otp

module.exports.SendOtp= async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    
    const response = await axios.post(
      `https://verify.twilio.com/v2/Services/${verifyServiceSid}/VerificationCheck`,
      new URLSearchParams({
        To: mobile,
        Code: otp
      }),
      {
        auth: {
          username: accountSid,
          password: authToken
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    if (response.data.status === 'approved') {
      res.json({ success: true, verified: true });
    } else {
      res.json({ success: false, verified: false });
    }
  } catch (error) {
    console.error('Twilio verification error:', error.response?.data);
    res.status(500).json({ success: false, error: 'OTP verification failed' });
  }
}


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
    console.log("Catagory Name:", catagoryName);
 
    const allCatagoryProducts = await Product.find({ category: catagoryName });
    console.log(allCatagoryProducts);
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
    

    res.redirect('/admin/datatable'); // or wherever you want
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