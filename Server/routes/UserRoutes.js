const express = require("express");


const routes = express.Router();
const UserCtl = require("../controllers/UserController")
const passport = require('passport');
const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/../.env` });
const authMiddleware = require('../middleware/authMiddleware');
const { strictLimiter, authLimiter } = require('../middleware/rateLimiter');




// Get all products
routes.get("/all", UserCtl.ShowAllProduct);

// Get product by ID (IMPORTANT: route must have a named param!)
routes.get("/Product", UserCtl.ShowProduct);
routes.get('/specifications-by-category', UserCtl.specific);

// Registration Route
routes.post("/register", authLimiter, UserCtl.SignUp);
// In your server routes file
routes.post('/login', authLimiter,
  passport.authenticate('local', { session: false }),
  UserCtl.SignIn
);
// Google OAuth Route
routes.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
routes.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_LINK}` }),
  UserCtl.GoogleSignIn  // your controller to handle cookie setting & redirect
);
// get user email

routes.post("/subscribe", UserCtl.subscribe)

// complete logine info
routes.post("/updateProfile", UserCtl.completeProfile)




routes.get("/catagoryproduct", UserCtl.ShowCatagoryProducts)
routes.post("/setbestproductlist", UserCtl.setBestProductList)
routes.get("/getbestproductlist", UserCtl.getBestProductList)

routes.post("/getCartItem", UserCtl.getCartItem);
routes.post("/cartedItem", UserCtl.getCartedItem);
routes.delete('/deleteCart', UserCtl.deleteCartItem);
// Update cart item (increment/decrement) — JWT protected
routes.put("/updateCart", authMiddleware, strictLimiter, UserCtl.updateCartItem);


routes.post("/send-otp", authLimiter, UserCtl.sendOtp);
routes.post("/updatePhone", UserCtl.updatePhone);

// send catagory
routes.get("/getCatagory", UserCtl.getCatagory);
routes.post("/verify-otp", authLimiter, UserCtl.verifyOtp);

// inquiry
routes.post("/submitInquiry", UserCtl.submitInquiry);
routes.delete("/clearCart", UserCtl.clearCart)
routes.get("/getUserInquiries/:uid", UserCtl.getUserInquiries)
routes.get("/getAllInquiries", UserCtl.getAllInquiries)
routes.patch("/updateInquiryStatus/:id", UserCtl.updateInquiryStatus);

module.exports = routes;
