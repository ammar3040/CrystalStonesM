const express = require("express");
const adminctl = require("../controllers/asdminController");

const multer = require('multer');
const { storage } = require("../config/cloudinaryConfig");
const upload = multer({ storage });


const routes = express.Router();

routes.get("/", adminctl.dashboard);
routes.get("/addform",adminctl.AddAdminForm)

routes.get("/datatable",adminctl.AdminTable)

routes.post("/AddProduct", upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'additionalImages', maxCount: 10 }
]), adminctl.AddProduct);

// routes.post("/insertData", upload.single('profileImage'), adminctl.insertData);
routes.post("/updateData", upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'additionalImages', maxCount: 10 }
]), adminctl.updateData);
routes.get("/EditPage",adminctl.AdminEdit)
routes.get("/deleteProduct",adminctl.ProductDelete)
// routes.get("/deleteImage",adminctl.ImageDelete)


module.exports = routes;
