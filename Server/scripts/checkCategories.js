const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const Catagory = require("../models/CatagoryModel");
const Product = require("../models/ProductModel");

async function cleanupCategories() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected successfully.");

        const categories = await Catagory.find({});
        console.log(`Found ${categories.length} total categories.`);
        console.log("--------------------------------------------------");

        let emptyCategories = [];

        for (const cat of categories) {
            const productCount = await Product.countDocuments({
                category: cat.category,
                is_deleted: false
            });

            console.log(`Category: "${cat.category}" | Products: ${productCount} | Current Status: ${cat.is_deleted ? "Deleted" : "Active"}`);

            if (productCount === 0 && !cat.is_deleted) {
                emptyCategories.push(cat);
            }
        }

        console.log("--------------------------------------------------");
        if (emptyCategories.length === 0) {
            console.log("No new empty categories to disable.");
        } else {
            console.log(`Disabling ${emptyCategories.length} empty categories...`);
            for (const cat of emptyCategories) {
                cat.is_deleted = true;
                await cat.save();
                console.log(`- Disabled: "${cat.category}"`);
            }
            console.log("Cleanup complete.");
        }

    } catch (error) {
        console.error("Error during cleanup:", error);
    } finally {
        await mongoose.connection.close();
        console.log("Database connection closed.");
    }
}

cleanupCategories();
