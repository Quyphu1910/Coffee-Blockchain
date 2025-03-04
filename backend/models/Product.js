const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productId: {
        type: Number,
        required: true,
        unique: true,
        index: true,
        description: 'Unique product ID (can be sequential or generated)',
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100,
        description: 'Name of the product',
    },
    description: {
        type: String,
        trim: true,
        description: 'Detailed description of the product',
    },
    price: {
        type: Number,
        required: true,
        min: 0,
        description: 'Price of the product in base currency (e.g., USD, VNĐ)',
    },
    imageUri: {
        type: String,
        required: true,
        trim: true,
        description: 'URL to the product image (Cloudinary, S3, etc.)',
    },
    category: {
        type: String,
        trim: true,
        description: 'Category of the product (e.g., Coffee, Pastry, etc.)',
    },
    tags: [{
        type: String,
        trim: true,
        description: 'Tags or keywords associated with the product',
    }],
    isAvailable: {
        type: Boolean,
        default: true,
        description: 'Indicates if the product is currently available for sale',
    },
    stockQuantity: {
        type: Number,
        default: 0,
        min: 0,
        description: 'Current stock quantity of the product',
    },
    discountPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
        description: 'Discount percentage applied to the product (0-100)',
    },
    sku: { // Stock Keeping Unit
        type: String,
        trim: true,
        description: 'Stock Keeping Unit (SKU) for internal product identification',
    },
    brand: {
        type: String,
        trim: true,
        description: 'Brand of the product',
    },
    variants: [{
        name: { type: String, trim: true, description: 'Variant name (e.g., Size)' },
        options: [{ type: String, trim: true, description: 'Variant option (e.g., Small, Medium, Large)' }],
    }],
    relatedProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        description: 'References to related products for recommendations',
    }],
    averageRating: {
        type: Number,
        default: 0,
        description: 'Average rating of the product (calculated from reviews)',
    },
    reviewCount: {
        type: Number,
        default: 0,
        description: 'Number of reviews for the product',
    },
    }, { timestamps: true, collection: 'products' }); 

module.exports = mongoose.model('Product', productSchema);