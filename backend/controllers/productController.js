// controllers/productController.js
const Product = require('../models/Product');
const cloudinary = require('../utils/cloudinary'); // For image uploads

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({ isAvailable: true }).sort({ productId: 1 }); // Fetch only available products, sort by productId
        res.json(products);
    } catch (error) {
        console.error("Error getting all products:", error);
        res.status(500).json({ message: "Failed to fetch products.", error: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findOne({ productId: productId, isAvailable: true }); // Find by productId, check availability
        if (!product) {
            return res.status(404).json({ message: "Product not found or is unavailable." });
        }
        res.json(product);
    } catch (error) {
        console.error("Error getting product by ID:", error);
        res.status(500).json({ message: "Failed to fetch product details.", error: error.message });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, category, tags, stockQuantity, discountPercentage, imageBase64 } = req.body;

        if (!name || !price || !imageBase64) { // Basic validation for required fields
            return res.status(400).json({ message: "Product name, price, and image are required." });
        }

        // Upload image to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(imageBase64, {
            upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET || 'your_upload_preset' // Use upload preset from .env or default
        });

        const newProduct = new Product({
            productId: Date.now(), // Simple way to generate productId, consider better methods for production
            name,
            description,
            price,
            category,
            tags: tags ? tags.split(',') : [], // Split tags string into array if provided
            stockQuantity,
            discountPercentage,
            imageUri: uploadResponse.secure_url,
            // ... other product fields from req.body ...
        });

        await newProduct.save();
        res.status(201).json({ message: "Product created successfully!", product: newProduct });

    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Failed to create product.", error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        const updateData = req.body;

        const product = await Product.findOne({ productId: productId });
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        // Handle image update if imageBase64 is provided
        if (updateData.imageBase64) {
            const uploadResponse = await cloudinary.uploader.upload(updateData.imageBase64, {
                upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET || 'your_upload_preset'
            });
            updateData.imageUri = uploadResponse.secure_url;
            delete updateData.imageBase64; // Remove base64 from updateData to avoid saving it to DB
        }

        await Product.findOneAndUpdate({ productId: productId }, updateData, { new: true, runValidators: true }); // FindOneAndUpdate for direct update
        const updatedProduct = await Product.findOne({ productId: productId }); // Fetch updated product

        res.json({ message: "Product updated successfully!", product: updatedProduct });

    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Failed to update product.", error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findOne({ productId: productId });
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        // Soft delete - set isAvailable to false instead of physically deleting from DB
        product.isAvailable = false;
        await product.save();

        // Or, if you want to physically delete: await Product.deleteOne({ productId: productId });

        res.json({ message: "Product deleted successfully (soft delete)." }); // Indicate soft delete

    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Failed to delete product.", error: error.message });
    }
};