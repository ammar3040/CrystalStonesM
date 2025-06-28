const express = require("express");
const routes = express.Router();
const adminRoutes = require("./adminRoutes");
const Product = require("../models/ProductModel");
const UserRoutes = require("./UserRoutes");

routes.use("/admin/", adminRoutes);
routes.use("/api/", UserRoutes);


module.exports = routes;
