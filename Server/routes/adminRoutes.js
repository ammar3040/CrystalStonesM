const express = require("express");
const adminctl = require("../controllers/asdminController");

const multer = require('multer');
const { storage } = require("../config/cloudinaryConfig");
const upload = multer({ storage });


const routes = express.Router();

routes.get("/addform", adminctl.AddAdminForm)

routes.get("/datatable", adminctl.AdminTable)
routes.get("/show-all-products", adminctl.AdminShowAllProducts)

routes.post("/AddProduct", upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'additionalImages', maxCount: 10 }
]), adminctl.AddProduct);

// routes.post("/insertData", upload.single('profileImage'), adminctl.insertData);
routes.post("/updateData", upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'additionalImages', maxCount: 10 }
]), adminctl.updateData);
routes.get("/EditPage", adminctl.AdminEdit) // have to delete this 
routes.get("/deleteProduct", adminctl.ProductDelete)

// routes.get("/deleteImage",adminctl.ImageDelete)


// admin panle user table

routes.get("/usertable", adminctl.UserTable)// have to delete this 
routes.get("/userdelete", adminctl.UserDelete)
routes.post("/addcatagory", upload.fields([
  { name: 'mainImage', maxCount: 1 }
]), adminctl.AddCatagory)

routes.get("/deletecatagory", adminctl.deleteCatagory)

// Inquiry Management
routes.get("/getInquiry", adminctl.getInquiry);
routes.get("/updateInquiryStatus", adminctl.updateInquiryStatus);

// Category & Filter Helpers
routes.get("/categories", adminctl.GetCategories);
routes.get("/crystal-types", adminctl.GetCrystalTypes);


module.exports = routes;
