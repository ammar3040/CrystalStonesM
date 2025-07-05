const express = require("express");
const routes = express.Router();
const adminRoutes = require("./adminRoutes");
const Product = require("../models/ProductModel");
const UserRoutes = require("./UserRoutes");
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });


routes.use("/admin/", adminRoutes);
routes.use("/api/", UserRoutes);
routes.post("/verify", async (req, res) => {
  const { otp, phone } = req.body;
console.log("Received OTP:", otp, "for phone:", phone); // 🚨 DEBUG THIS

  try {
    const verify = await axios.post(
      "https://api.msg91.com/api/v5/otp/verify",
      { otp, mobile: phone },
      { headers: { Authkey: process.env.MSG91_AUTHKEY } }
    );

    console.log("MSG91 Response:", verify.data); // 🚨 DEBUG THIS

    if (verify.data.type === "success") {
      res.json({ success: true });
    } else {
      res.status(400).json({ 
        error: "OTP failed",
        msg91Error: verify.data.message // Forward MSG91's error
      });
    }
  } catch (err) {
    console.error("MSG91 API Error:", err.response?.data || err.message);
    res.status(500).json({ 
      error: "Server error",
      details: err.response?.data || err.message
    });
  }
});
routes.get("/logout", (req, res) => {
  try {
    // Clear the user cookie
    res.clearCookie('user', {
      path: '/',
      httpOnly: false,
      secure: true,
      sameSite: 'none',
    });

    // Redirect to frontend login page
    res.redirect(`${process.env.FRONTEND_LINK}`); // Change to your actual frontend login URL
  } catch (err) {
    console.error("Logout Error:", err);
    res.status(500).json({ error: "Logout failed" });
  }
});


module.exports = routes;
