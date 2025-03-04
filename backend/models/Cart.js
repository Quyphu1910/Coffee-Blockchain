const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
        description: 'Reference to the user who owns the cart',
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
            description: 'Reference to the product in the cart item',
        },
        quantity: {
            type: Number,
            default: 1,
            min: 1,
            description: 'Quantity of the product in the cart item',
        },
        variant: { 
            type: String,
            description: 'Selected variant option (e.g., Size: Large)',
        }
        
    }],
    totalItems: { 
        type: Number,
        default: 0,
        description: 'Total number of items in the cart (sum of quantities)',
    },
    subtotal: {
        type: Number,
        default: 0,
        description: 'Subtotal price of all items in the cart (before discounts, taxes, etc.)',
    },
    
    createdAt: {
        type: Date,
        default: Date.now,
        description: 'Date when the cart was created',
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        description: 'Date when the cart was last updated',
    }
}, { timestamps: true, collection: 'carts' }); 

module.exports = mongoose.model('Cart', cartSchema);