const express = require("express");


const routes = express.Router();
const UserCtl=require("../controllers/UserController")

const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/../.env` }); 




// Get all products
routes.get("/all",UserCtl.ShowAllProduct);

// Get product by ID (IMPORTANT: route must have a named param!)
routes.get("/Product",UserCtl.ShowProduct);


// Registration Route
routes.post("/register", UserCtl.SignUp);
// In your server routes file
routes.post('/login', UserCtl.SignIn);
routes.post("/send-otp",UserCtl.SendOtp)
routes.get("/catagoryproduct",UserCtl.ShowCatagoryProducts)
routes.post("/setbestproductlist",UserCtl.setBestProductList)
routes.get("/getbestproductlist",UserCtl.getBestProductList)


// send catagory
routes.get("/getCatagory",UserCtl.getCatagory);

module.exports = routes;
