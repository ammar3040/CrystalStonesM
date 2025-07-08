
const moment = require("moment");


const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const { log } = require("console");
const Product = require('../models/ProductModel'); // Import Product model
const { v2: cloudinary } = require("cloudinary"); //for deletion
const UserModel=require("../models/UserModel")
const CatagoryModel = require("../models/CatagoryModel");



// addForm
module.exports.AddAdminForm= async(req,res)=>{
  const allCatagoryData = await CatagoryModel.find();
 
   res.status(200).send("Product added");
// Pass the categories to the view
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
      modelNumber,
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
      modelNumber,
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
     res.status(200).json({ success: true, message:"Product deleted successfully"});
  } catch (err) {
      res.status(500).json({ success: false, message: 'error in deleting ' });
  }

  return res.redirect("/admin/datatable");
};

// edit form 
// module.exports.EditAdminForm=(req,res)=>{
//   res.render("EditAdminForm");
// }


module.exports.AdminEdit = async (req, res) => {
  try {
    let allCatagoryData = await CatagoryModel.find();
    let ProductId = req.query.id;
    let ProductData = await Product.findOne({ _id: ProductId });

    if (ProductData) {
      return res.status(200).json({
        success: true,
        product: ProductData,
        categories: allCatagoryData,
      });
    } else {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};


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
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const updateData = { ...req.body };
    const { id, length, width, height, ...rest } = updateData;

    // Dimensions
    rest.dimensions = {
      length: Math.max(0, Number(length) || 0),
      width: Math.max(0, Number(width) || 0),
      height: Math.max(0, Number(height) || 0)
    };

    // Benefits
    rest.benefits = Array.isArray(req.body.benefits)
      ? req.body.benefits.filter(Boolean)
      : req.body.benefits
        ? [req.body.benefits].filter(Boolean)
        : [];

    // Main image
    if (req.files?.mainImage?.[0]) {
      if (existingProduct.mainImage?.public_id) {
        await cloudinary.uploader.destroy(existingProduct.mainImage.public_id, { invalidate: true });
      }

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
      rest.mainImage = existingProduct.mainImage;
    }

    // Additional images
    if (req.files?.additionalImages?.length > 0) {
      if (existingProduct.additionalImages?.length > 0) {
        for (const img of existingProduct.additionalImages) {
          if (img?.public_id) {
            await cloudinary.uploader.destroy(img.public_id, { invalidate: true });
          }
        }
      }

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
            throw new Error("Failed to upload some additional images");
          }
        }
      }
      rest.additionalImages = uploadedImages;
    } else {
      rest.additionalImages = existingProduct.additionalImages || [];
    }

    rest.updatedAt = new Date();

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      rest,
      { new: true, runValidators: true, session }
    );

    if (!updatedProduct) {
      throw new Error("Failed to update product in database");
    }

    await session.commitTransaction();
    return res.status(200).json({ success: true, message: "Product updated successfully" });
  } catch (err) {
    await session.abortTransaction();
    return res.status(500).json({ success: false, message: err.message });
  } finally {
    session.endSession();
  }
};

// admin panle user data table rander

module.exports.UserTable = async (req, res) => {
  try {
    const AllUserData = await UserModel.find();

    return res.status(200).json(AllUserData);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports.UserDelete = async (req, res) => {
  const userId = req.query.uid;

  if (!userId) {
    console.error("User ID is required for deletion");
    return res.status(400).json({ success: false, message: "User ID is required" });
  }

  try {
    const deletedUser = await UserModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      console.error("User not found for deletion");
      return res.status(404).json({ success: false, message: "User not found" });
    } else {
      console.log("User deleted successfully:", deletedUser);
      return res.json({ success: true, message: "User deleted successfully" });
    }
  } catch (err) {
    console.error("Error deleting user:", err);
    return res.status(500).json({ success: false, message: "Server error while deleting user" });
  }
};


// Adjust the path as needed


// add catagory

module.exports.AddCatagory = async (req, res) => {
  try {
    const category = req.body.category?.trim();
    const mainImage = req.files?.mainImage?.[0];

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

    // ✅ Send success response for React frontend
    return res.status(200).json({
      message: "Category added successfully",
      category: newCatagory
    });

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
    
    // ✅ Important: send response back to frontend
    return res.status(200).json({ message: "Catagory deleted successfully" });

  } catch (err) {
    console.error("Error deleting catagory:", err);
    return res.status(500).send("Failed to delete catagory");
  }
};
