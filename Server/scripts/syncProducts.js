const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('../models/ProductModel'); // Adjust path if needed
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URL = process.env.MONGODB_URL;

async function syncProducts() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URL);
        console.log('Connected to MongoDB.');

        // 1. Fetch all products
        const products = await Product.find({}).lean();
        console.log(`Found ${products.length} products.`);

        // 2. Backup current products to JSON
        const backupPath = path.resolve(__dirname, '../backups/products_backup.json');
        if (!fs.existsSync(path.dirname(backupPath))) {
            fs.mkdirSync(path.dirname(backupPath), { recursive: true });
        }
        fs.writeFileSync(backupPath, JSON.stringify(products, null, 2));
        console.log(`Backup saved to ${backupPath}`);

        // 3. Prepare migration
        const updatedProducts = [];
        const migrationOperations = [];

        for (const prod of products) {
            let updated = { ...prod };
            const sizes = Array.isArray(prod.sizes) ? [...prod.sizes] : [];

            // Check for dollarPrice or originalPrice
            // Note: originalPrice might not be in the schema but could be in the doc
            const dPrice = prod.dollarPrice;
            const oPrice = prod.originalPrice;

            if (dPrice !== undefined && dPrice !== null) {
                // Add to sizes if not already there as 'default'
                const hasDefault = sizes.find(s => s.size === 'default');
                if (!hasDefault) {
                    sizes.push({ size: 'default', price: dPrice });
                }
            } else if (oPrice !== undefined && oPrice !== null) {
                // Fallback to originalPrice if dollarPrice is missing
                const hasDefault = sizes.find(s => s.size === 'default');
                if (!hasDefault) {
                    sizes.push({ size: 'default', price: oPrice });
                }
            }

            updated.sizes = sizes;

            // Clean up fields
            delete updated.dollarPrice;
            delete updated.originalPrice;

            updatedProducts.push(updated);

            // Prepare DB update
            migrationOperations.push(
                Product.updateOne(
                    { _id: prod._id },
                    {
                        $set: { sizes: sizes },
                        $unset: { dollarPrice: "", originalPrice: "" }
                    }
                )
            );
        }

        // 4. Save updated products to JSON
        const updatedPath = path.resolve(__dirname, '../backups/products_updated.json');
        fs.writeFileSync(updatedPath, JSON.stringify(updatedProducts, null, 2));
        console.log(`Updated data preview saved to ${updatedPath}`);

        // 5. Execute DB updates
        console.log('Executing database updates...');
        await Promise.all(migrationOperations);
        console.log('Database sync complete!');

    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
    }
}

syncProducts();
