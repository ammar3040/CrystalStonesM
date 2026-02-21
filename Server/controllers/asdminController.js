
const moment = require("moment");

const { validationResult } = require("express-validator");

const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const { log } = require("console");
const Product = require('../models/ProductModel'); // Import Product model
const { v2: cloudinary } = require("cloudinary"); //for deletion
const UserModel = require("../models/UserModel")
const CatagoryModel = require("../models/CatagoryModel");



// addForm
module.exports.AddAdminForm = async (req, res) => {
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
    console.log("body :", req.body);

    if (!req.files?.mainImage || !req.files.mainImage[0]) {
      return res.status(400).send("Main image is required.");
    }

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
      MinQuantity,
      modelNumber,
      benefits = [],
      sizes = []
    } = req.body;

    // Handle specifications
    let specifications = [];
    if (req.body.specifications) {
      try {
        specifications = Array.isArray(req.body.specifications)
          ? req.body.specifications
          : JSON.parse(req.body.specifications);
      } catch (e) {
        console.error("Failed to parse specifications", e);
      }
    }

    // Handle sizes
    let parsedSizes = [];
    if (sizes) {
      try {
        const rawSizes = Array.isArray(sizes)
          ? sizes
          : JSON.parse(sizes);

        // Filter out empty entries (where size is empty OR price is null/undefined)
        parsedSizes = rawSizes.filter(s => s.size && s.size.trim() !== "" && s.price !== null && s.price !== undefined);
      } catch (e) {
        console.error("Failed to parse sizes", e);
      }
    }

    // Process images
    const mainImage = req.files.mainImage[0];
    const mainImageData = {
      url: mainImage.path,
      public_id: mainImage.filename
    };

    const additionalImages = req.files.additionalImages
      ? req.files.additionalImages.map(file => ({
        url: file.path,
        public_id: file.filename
      }))
      : [];

    // If no sizes are provided but dollarPrice exists, create a default size
    if (parsedSizes.length === 0 && dollarPrice) {
      parsedSizes.push({ size: 'default', price: Number(dollarPrice) });
    }

    // Create new product
    const product = new Product({
      productName,
      description,
      category,
      // Deprecated fields: originalPrice, dollarPrice, discountedPrice
      specifications,
      quantityUnit,
      MinQuantity,
      modelNumber,
      crystalType,
      benefits: Array.isArray(benefits) ? benefits : [benefits].filter(Boolean),
      sizes: parsedSizes,
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

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product
    });

  } catch (err) {
    console.error("AddProduct Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to add product",
      error: err.message
    });
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
    res.status(200).json({ success: true, message: "Product deleted successfully" });
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
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const productId = req.body.id;
    if (!productId) {
      throw new Error("Product ID is required");
    }

    // Check if product exists
    const existingProduct = await Product.findById(productId).session(session).lean();
    if (!existingProduct) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Prepare update data
    const updateData = { ...req.body };
    const { id, length, width, height, removedAdditionalImages = [], ...rest } = updateData;

    // Process dimensions
    rest.dimensions = {
      length: Math.max(0, Number(length) || existingProduct.dimensions?.length || 0),
      width: Math.max(0, Number(width) || existingProduct.dimensions?.width || 0),
      height: Math.max(0, Number(height) || existingProduct.dimensions?.height || 0)
    };

    // Process benefits
    rest.benefits = Array.isArray(req.body.benefits)
      ? req.body.benefits.filter(Boolean)
      : req.body.benefits
        ? [req.body.benefits].filter(Boolean)
        : existingProduct.benefits || [];

    // Process specifications
    if (req.body.specifications) {
      try {
        rest.specifications = Array.isArray(req.body.specifications)
          ? req.body.specifications
          : JSON.parse(req.body.specifications);

        if (!rest.specifications.every(spec => spec.key && spec.value)) {
          throw new Error("Specifications must have both key and value");
        }
      } catch (e) {
        throw new Error("Invalid specifications format");
      }
    } else {
      rest.specifications = existingProduct.specifications || [];
    }

    // Process sizes
    if (req.body.sizes) {
      try {
        rest.sizes = Array.isArray(req.body.sizes)
          ? req.body.sizes
          : JSON.parse(req.body.sizes);

        // Filter out empty entries (where size is empty OR price is null/undefined)
        rest.sizes = rest.sizes
          .map(size => ({
            size: String(size.size || '').trim(),
            price: size.price !== null && size.price !== undefined ? parseFloat(size.price) : null
          }))
          .filter(size => size.size && size.size !== "" && size.price !== null && !isNaN(size.price));
      } catch (e) {
        console.error("Error parsing sizes:", e);
        throw new Error("Invalid sizes format");
      }
    } else {
      rest.sizes = existingProduct.sizes || [];
    }

    // Process main image
    if (req.files?.mainImage?.[0]) {
      // Validate image type
      const validImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validImageTypes.includes(req.files.mainImage[0].mimetype)) {
        throw new Error("Main image must be a JPEG, PNG, or WEBP file");
      }

      // Delete old image if exists
      if (existingProduct.mainImage?.public_id) {
        await cloudinary.uploader.destroy(existingProduct.mainImage.public_id, {
          invalidate: true
        });
      }

      // Upload new image
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

    // Process additional images
    const additionalImagesToKeep = existingProduct.additionalImages?.filter(img =>
      !removedAdditionalImages.includes(img.public_id)
    ) || [];

    if (req.files?.additionalImages?.length > 0) {
      // Validate image types
      for (const file of req.files.additionalImages) {
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
          throw new Error("Additional images must be JPEG, PNG, or WEBP files");
        }
      }

      // Upload new additional images in batches
      const batchSize = 3;
      const uploadedImages = [];

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

      rest.additionalImages = [...additionalImagesToKeep, ...uploadedImages];
    } else {
      rest.additionalImages = additionalImagesToKeep;
    }

    // Delete removed images from Cloudinary
    if (removedAdditionalImages.length > 0) {
      await Promise.allSettled(
        removedAdditionalImages.map(publicId =>
          cloudinary.uploader.destroy(publicId, { invalidate: true })
        )
      );
    }

    // If no sizes are provided in the update but dollarPrice is, convert it to a default size
    if ((!rest.sizes || rest.sizes.length === 0) && req.body.dollarPrice) {
      rest.sizes = [{ size: 'default', price: Number(req.body.dollarPrice) }];
    }

    rest.updatedAt = new Date();

    // Update product and cleanup deprecated fields
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        $set: rest,
        $unset: { dollarPrice: "", originalPrice: "", discountedPrice: "" }
      },
      {
        new: true,
        runValidators: true,
        session
      }
    );

    if (!updatedProduct) {
      throw new Error("Failed to update product in database");
    }

    await session.commitTransaction();
    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct
    });
  } catch (err) {
    await session.abortTransaction();
    console.error("Update Product Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Something went wrong while updating product"
    });
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
