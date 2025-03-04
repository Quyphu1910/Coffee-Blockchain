// controllers/productController.js
const Product = require('../models/Product');
const { s3Upload } = require('../utils/s3');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({ isAvailable: true }).sort({ productId: 1 });
        res.status(200).json(products); // Return 200 OK with products
    } catch (error) {
        console.error("Error getting all products:", error);
        res.status(500).json({ message: "Failed to fetch products.", error: error.message }); // 500 Server Error
    }
};

exports.getProductById = async (req, res) => {
    try {
        const productId = req.params.productId;
        if (!productId) {
            return res.status(400).json({ message: "Product ID is required." }); // 400 Bad Request - invalid input
        }

        const product = await Product.findOne({ productId: productId, isAvailable: true });
        if (!product) {
            return res.status(404).json({ message: "Product not found or is unavailable." }); // 404 Not Found
        }
        res.status(200).json(product); // 200 OK - return product
    } catch (error) {
        console.error("Error getting product by ID:", error);
        res.status(500).json({ message: "Failed to fetch product details.", error: error.message }); // 500 Server Error
    }
};

exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, category, tags, stockQuantity, discountPercentage } = req.body;
        const imageFile = req.file;

        // Validation input dữ liệu
        if (!name || !price || !imageFile) {
            return res.status(400).json({ message: "Product name, price, and image are required." });
        }

        if (isNaN(price) || parseFloat(price) <= 0) {
            return res.status(400).json({ message: "Price must be a positive number." });
        }
        if (isNaN(stockQuantity) || parseInt(stockQuantity) < 0) {
            return res.status(400).json({ message: "Stock quantity must be a non-negative number." });
        }
        if (isNaN(discountPercentage) || parseFloat(discountPercentage) < 0 || parseFloat(discountPercentage) > 100) {
            return res.status(400).json({ message: "Discount percentage must be between 0 and 100." });
        }

        // Convert file buffer to base64 for S3 upload
        const base64Image = imageFile.buffer.toString('base64');
        const imageName = `product-images/${Date.now()}-${name.replace(/\s+/g, '-')}.jpg`;
        
        let imageUri = null;
        try {
            imageUri = await s3Upload(base64Image, process.env.AWS_S3_BUCKET_NAME, imageName);
        } catch (uploadError) {
            console.error("S3 Upload Error:", uploadError);
            return res.status(500).json({ message: "Failed to upload image to S3.", error: uploadError.message });
        }

        // Tạo document Product mới
        const newProduct = new Product({
            productId: Date.now(),
            name,
            description,
            price: parseFloat(price),
            category,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            stockQuantity: parseInt(stockQuantity),
            discountPercentage: parseFloat(discountPercentage),
            imageUri: imageUri,
            isAvailable: parseInt(stockQuantity) > 0,
        });

        await newProduct.save();
        res.status(201).json({ message: "Product created successfully!", product: newProduct });

    } catch (error) {
        console.error("Error creating product:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: "Validation error during product creation.", errors: error.errors });
        }
        res.status(500).json({ message: "Failed to create product.", error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        const updateData = { ...req.body };
        const imageFile = req.file;

        // Validation
        if (updateData.price !== undefined && (isNaN(updateData.price) || parseFloat(updateData.price) <= 0)) {
            return res.status(400).json({ message: "Price must be a positive number." });
        }
        if (updateData.stockQuantity !== undefined && (isNaN(updateData.stockQuantity) || parseInt(updateData.stockQuantity) < 0)) {
            return res.status(400).json({ message: "Stock quantity must be a non-negative number." });
        }
        if (updateData.discountPercentage !== undefined && (isNaN(updateData.discountPercentage) || parseFloat(updateData.discountPercentage) < 0 || parseFloat(updateData.discountPercentage) > 100)) {
            return res.status(400).json({ message: "Discount percentage must be between 0 and 100." });
        }

        const product = await Product.findOne({ productId: productId });
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        // Handle image update if new image is uploaded
        if (imageFile) {
            const base64Image = imageFile.buffer.toString('base64');
            const imageName = `product-images/${Date.now()}-${updateData.name || product.name}.jpg`;
            updateData.imageUri = await s3Upload(base64Image, process.env.AWS_S3_BUCKET_NAME, imageName);
        }

        // Convert types for numeric fields
        if (updateData.price) updateData.price = parseFloat(updateData.price);
        if (updateData.stockQuantity) updateData.stockQuantity = parseInt(updateData.stockQuantity);
        if (updateData.discountPercentage) updateData.discountPercentage = parseFloat(updateData.discountPercentage);
        if (updateData.tags) updateData.tags = updateData.tags.split(',').map(tag => tag.trim());

        const updatedProduct = await Product.findOneAndUpdate(
            { productId: productId },
            updateData,
            { new: true, runValidators: true }
        );

        res.json({ message: "Product updated successfully!", product: updatedProduct });

    } catch (error) {
        console.error("Error updating product:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: "Validation error during product update.", errors: error.errors });
        }
        res.status(500).json({ message: "Failed to update product.", error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        if (!productId) {
            return res.status(400).json({ message: "Product ID is required for deletion." }); // 400 Bad Request - invalid input
        }

        const product = await Product.findOne({ productId: productId });
        if (!product) {
            return res.status(404).json({ message: "Product not found." }); // 404 Not Found
        }

        product.isAvailable = false; // Soft delete
        await product.save();

        res.status(200).json({ message: "Product deleted successfully (soft delete)." }); // 200 OK - success message

    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Failed to delete product.", error: error.message }); // 500 Server Error
    }
};