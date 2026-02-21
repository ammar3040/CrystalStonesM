const express = require("express");
const routes = express.Router();
const adminRoutes = require("./adminRoutes");
const Product = require("../models/ProductModel");
const UserRoutes = require("./UserRoutes");
const chatRoutes = require("./chatRoutes");
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });


routes.use("/admin/", adminRoutes);
routes.use("/api/", UserRoutes);
routes.use("/api/chat/", chatRoutes);
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
