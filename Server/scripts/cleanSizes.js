const mongoose = require('mongoose');
const path = require('path');
const Product = require('../models/ProductModel');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URL = process.env.MONGODB_URL;

async function cleanSizes() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URL);
        console.log('Connected to MongoDB.');

        // Find products that have sizes with empty string size or null price
        const products = await Product.find({
            $or: [
                { "sizes.size": "" },
                { "sizes.price": null }
            ]
        });

        console.log(`Found ${products.length} products with potentially empty sizes.`);

        let totalCleaned = 0;
        for (const prod of products) {
            const originalCount = prod.sizes.length;
            // Filter out sizes where size is empty OR price is null
            const cleanedSizes = prod.sizes.filter(s => s.size !== "" && s.price !== null);

            if (cleanedSizes.length !== originalCount) {
                await Product.updateOne(
                    { _id: prod._id },
                    { $set: { sizes: cleanedSizes } }
                );
                totalCleaned++;
            }
        }

        console.log(`Cleanup complete! ${totalCleaned} products were updated.`);

    } catch (err) {
        console.error('Cleanup failed:', err);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
    }
}

cleanSizes();
