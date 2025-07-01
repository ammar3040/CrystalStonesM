
const moment = require("moment");


const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const { log } = require("console");
const Product = require('../models/ProductModel'); // Import Product model
const { v2: cloudinary } = require("cloudinary"); //for deletion
const UserModel=require("../models/UserModel")
const CatagoryModel = require("../models/CatagoryModel");

module.exports.dashboard = (req, res) => {
 return res.render("Dashboard") 
};


// addForm
module.exports.AddAdminForm= async(req,res)=>{
  const allCatagoryData = await CatagoryModel.find();
 
    return res.render("AddAdminform", { allCatagoryData });// Pass the categories to the view
}



// admintable
module.exports.AdminTable = async (req, res) => {
  try {
let allProductData = await Product.find();
// console.log(allProductData); // should log array

    
    return res.render("AdminDataTable", { allProductData });
} catch (err) {
  console.error("Error loading admin data:", err.stack || err);
  return res.status(500).send("Failed to load admin data");
}

};


// insertForm for Product 



module.exports.AddProduct = async (req, res) => {
  try {
    const {
      productName,
      description,
      category,
      originalPrice,
      discountedPrice,
      dollarPrice,
      crystalType,
      length,
      width,
      height,
      specialNotes,
      quantityUnit,
      bestproduct,
      MinQuantity
    } = req.body;

    const benefits = Array.isArray(req.body.benefits)
      ? req.body.benefits
      : req.body.benefits ? [req.body.benefits] : [];

    // ✅ Extract mainImage
    const mainImage = req.files.mainImage[0];
    const mainImageData = {
      url: mainImage.path,
      public_id: mainImage.filename
    };

    // ✅ Extract additionalImages
    const additionalImages = req.files.additionalImages
      ? req.files.additionalImages.map(file => ({
          url: file.path,
          public_id: file.filename
        }))
      : [];

    // ✅ Save to MongoDB
    const product = new Product({
      productName,
      description,
      category,
      originalPrice,
      discountedPrice,
      dollarPrice,
      benefits,
      quantityUnit,
      MinQuantity,
      crystalType,
       bestproduct,
      dimensions: {
        length,
        width,
        height
      },
      specialNotes,
      mainImage: mainImageData,
      additionalImages
    });

    await product.save();

    res.redirect("/admin/addform"); // Or show success message
  } catch (err) {
    console.error("AddProduct Error:", err);
    res.status(500).send("Something went wrong while adding product.");
  }
};




// admin Crud


// adminDelete

module.exports.ProductDelete = async (req, res) => {
  try {
    const productId = req.query.id;

    const productData = await Product.findById(productId);

    if (!productData) {
      console.log("Product not found");
      return res.redirect("/admin/datatable");
    }

    // Delete main image from Cloudinary
    if (productData.mainImage && productData.mainImage.public_id) {
      await cloudinary.uploader.destroy(productData.mainImage.public_id);
      console.log("Main image deleted");
    }

    // Delete all additional images from Cloudinary
    if (productData.additionalImages && productData.additionalImages.length > 0) {
      for (let img of productData.additionalImages) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }
      console.log("Additional images deleted");
    }

    // Finally, delete the product from MongoDB
    await Product.findByIdAndDelete(productId);
    console.log("Product deleted successfully");
  } catch (err) {
    console.error("Error deleting product:", err);
  }

  return res.redirect("/admin/datatable");
};

// edit form 
// module.exports.EditAdminForm=(req,res)=>{
//   res.render("EditAdminForm");
// }


module.exports.AdminEdit=async(req,res)=>{
  try{


let allCatagoryData = await CatagoryModel.find();
 let ProductId =req.query.id;
let ProductData= await Product.findOne({_id:ProductId})
 if(ProductData){
console.log(ProductData);

 return res.render("EditAdminForm", {ProductData, allCatagoryData }); // Pass the product


 }else{

  console.log("admin data not found in edit ");
  res.redirect("/admin/dataTable")
  
 }


 }catch(err){
console.log(err);
}
return res.redirect("/admin/datatable")


}

module.exports.updateData = async (req, res) => {
  const session = await Product.startSession();
  session.startTransaction();

  try {
    const productId = req.body.id;
    if (!productId) {
      throw new Error("Product ID is required");
    }

    const existingProduct = await Product.findById(productId).session(session).lean();
    if (!existingProduct) {
      console.error('❌ Product not found in database');
      await session.abortTransaction();
      return res.redirect("/admin/datatable");
    }

    const updateData = { ...req.body };
    const { id, length, width, height, ...rest } = updateData;
    
    // Process dimensions
    rest.dimensions = {
      length: Math.max(0, Number(length) || 0),
      width: Math.max(0, Number(width) || 0),
      height: Math.max(0, Number(height) || 0)
    };

    // Process benefits
    rest.benefits = Array.isArray(req.body.benefits)
      ? req.body.benefits.filter(Boolean)
      : req.body.benefits
        ? [req.body.benefits].filter(Boolean)
        : [];

    // Handle main image update
    if (req.files?.mainImage?.[0]) {
      // Delete old main image if exists
      if (existingProduct.mainImage?.public_id) {
        try {
          await cloudinary.uploader.destroy(existingProduct.mainImage.public_id, { invalidate: true });
          console.log(`🗑️ Deleted old main image: ${existingProduct.mainImage.public_id}`);
        } catch (err) {
          console.error("❌ Main image deletion failed:", err.message);
          throw new Error("Failed to delete old main image");
        }
      }

      // Upload new main image
      const mainImageFile = req.files.mainImage[0];
      const mainImageUpload = await cloudinary.uploader.upload(mainImageFile.path, {
        folder: 'CrystalStonsMart-Product',
        resource_type: 'auto'
      });
      rest.mainImage = {
        url: mainImageUpload.secure_url,
        public_id: mainImageUpload.public_id
      };
    } else {
      // Keep existing main image if not updating
      rest.mainImage = existingProduct.mainImage;
    }

    // Handle additional images update
    if (req.files?.additionalImages?.length > 0) {
      // Delete all old additional images if new ones are being uploaded
      if (existingProduct.additionalImages?.length > 0) {
        for (const img of existingProduct.additionalImages) {
          if (img?.public_id) {
            try {
              await cloudinary.uploader.destroy(img.public_id, { invalidate: true });
              console.log(`🗑️ Deleted additional image: ${img.public_id}`);
            } catch (err) {
              console.error("❌ Error deleting additional image:", err.message);
              throw new Error("Failed to delete old additional images");
            }
          }
        }
      }

      // Upload new additional images in batches
      const uploadedImages = [];
      const batchSize = 3;
      for (let i = 0; i < req.files.additionalImages.length; i += batchSize) {
        const batch = req.files.additionalImages.slice(i, i + batchSize);
        const results = await Promise.allSettled(
          batch.map(file => cloudinary.uploader.upload(file.path, {
            folder: 'CrystalStonsMart-Product',
            resource_type: 'auto'
          }))
        );

        for (const result of results) {
          if (result.status === 'fulfilled') {
            uploadedImages.push({
              url: result.value.secure_url,
              public_id: result.value.public_id
            });
          } else {
            console.error("❌ Additional image upload failed:", result.reason.message);
            throw new Error("Failed to upload some additional images");
          }
        }
      }
      rest.additionalImages = uploadedImages;
    } else {
      // Keep existing additional images if not updating
      rest.additionalImages = existingProduct.additionalImages || [];
    }

    rest.updatedAt = new Date();

    // Update database
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      rest,
      { new: true, runValidators: true, session }
    );

    if (!updatedProduct) {
      throw new Error("Failed to update product in database");
    }

    await session.commitTransaction();
    console.log("✅ Product updated successfully");
    return res.redirect("/admin/datatable");
  } catch (err) {
    await session.abortTransaction();
    console.error("❌ UPDATE ERROR:", err.message);
    return res.redirect("/admin/datatable");
  } finally {
    session.endSession();
  }
};
// admin panle user data table rander

module.exports.UserTable=async (req, res) => {
  const AllUserData = await UserModel.find({role:"user"})
  console.log("AllUserData", AllUserData);
  

  return res.render("UserTable", { AllUserData });
}
module.exports.UserDelete=async (req, res) => {
const userId = req.query.uid;
  console.log("User ID to delete:", userId);  
  if (!userId) {
    console.error("User ID is required for deletion");
   
  }else{
    try {
      const deletedUser = await UserModel.findByIdAndDelete(userId);
      if (!deletedUser) {
        console.error("User not found for deletion");
      
      } else {  
        console.log("User deleted successfully:", deletedUser);
       
      }  }  catch (err) {
      console.error("Error deleting user:", err);
     
      }
     return res.redirect("/admin/usertable");}

}
module.exports.ShowCatagory=async (req, res) => {
  try {
    const allCatagoryData = await CatagoryModel.find();
    return res.render("ShowCatagory",{ allCatagoryData });
  } catch (err) {
    console.error("Error rendering AddCatagory:", err);
    return res.status(500).send("Failed to load AddCatagory page");
  }
};
// Adjust the path as needed


// add catagory

module.exports.AddCatagory = async (req, res) => {
  try {
  const category = req.body.category?.trim();

    const mainImage = req.files?.mainImage?.[0]; // safer access with optional chaining

    if (!category || !mainImage) {
      return res.status(400).send("Category name and image is required");
    }

    const mainImageData = {
      url: mainImage.path,
      public_id: mainImage.filename
    };

    const newCatagory = new CatagoryModel({
      category,
      mainImage: mainImageData
    });

    await newCatagory.save();

    // ✅ Redirect to category table page
    return res.redirect("/admin/catagorytable");
    
  } catch (err) {
    console.error("Error adding category:", err);
    return res.status(500).send("Failed to add category");
  }
};
// delete catagory


module.exports.deleteCatagory = async (req, res) => {
  try {
    const catagoryId = req.query.cid; 

    if (!catagoryId) {
      console.error("Catagory ID is required for deletion");
      return res.status(400).send("Catagory ID is required");
    }

    const deletedCatagory = await CatagoryModel.findByIdAndDelete(catagoryId);
    if (!deletedCatagory) {
      console.error("Catagory not found for deletion");
      return res.status(404).send("Catagory not found");
    }

    // Delete the main image from Cloudinary
    if (deletedCatagory.mainImage && deletedCatagory.mainImage.public_id) {
      await cloudinary.uploader.destroy(deletedCatagory.mainImage.public_id);
      console.log("Main image deleted from Cloudinary");
    }

    console.log("Catagory deleted successfully:", deletedCatagory);
  } catch (err) {
    console.error("Error deleting catagory:", err);
    return res.status(500).send("Failed to delete catagory");
  }

  return res.redirect("/admin/catagorytable");
}