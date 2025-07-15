const express = require("express");


const routes = express.Router();
const UserCtl=require("../controllers/UserController")
const passport = require('passport');
const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/../.env` }); 




// Get all products
routes.get("/all",UserCtl.ShowAllProduct);

// Get product by ID (IMPORTANT: route must have a named param!)
routes.get("/Product",UserCtl.ShowProduct);


// Registration Route
routes.post("/register", UserCtl.SignUp);
// In your server routes file
routes.post('/login',
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

routes.post("/subscribe",UserCtl.subscribe)




routes.get("/catagoryproduct",UserCtl.ShowCatagoryProducts)
routes.post("/setbestproductlist",UserCtl.setBestProductList)
routes.get("/getbestproductlist",UserCtl.getBestProductList)

routes.post("/getCartItem", UserCtl.getCartItem);
routes.post("/cartedItem", UserCtl.getCartedItem);
routes.delete('/deleteCart', UserCtl.deleteCartItem);


routes.post("/send-otp", UserCtl.sendOtp);
routes.post("/updatePhone", UserCtl.updatePhone);

// send catagory
routes.get("/getCatagory",UserCtl.getCatagory);
routes.post("/verify-otp", UserCtl.verifyOtp);

// inquiry
routes.post("/submitInquiry", UserCtl.submitInquiry);
routes.delete("/clearCart",UserCtl.clearCart)
routes.get("/getUserInquiries/:uid", UserCtl.getUserInquiries)
routes.get("/getAllInquiries", UserCtl.getAllInquiries)
routes.patch("/updateInquiryStatus/:id",UserCtl.updateInquiryStatus);

module.exports = routes;
