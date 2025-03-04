// controllers/cartController.js
const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart) {
            const newCart = new Cart({ userId, items: [] });
            await newCart.save();
            return res.status(200).json(newCart);
        }
        res.status(200).json(cart);
    } catch (error) {
        console.error("Error getting cart:", error);
        res.status(500).json({ message: "Failed to retrieve cart.", error: error.message });
    }
};

exports.addItemToCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productId, quantity = 1 } = req.body;

        if (!productId) {
            return res.status(400).json({ message: "Product ID is required." });
        }
        if (quantity <= 0) {
            return res.status(400).json({ message: "Quantity must be greater than zero." });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }
        if (!product.isAvailable || product.stockQuantity < quantity) {
            return res.status(400).json({ message: "Product is unavailable or out of stock." });
        }

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const cartItemIndex = cart.items.findIndex(item => item.productId.equals(productId));
        if (cartItemIndex > -1) {
            cart.items[cartItemIndex].quantity += quantity;
        } else {
            cart.items.push({ productId, quantity });
        }

        await cart.save();
        const populatedCart = await cart.populate('items.productId'); // Populate after save
        res.status(200).json({ message: "Product added to cart successfully!", cart: populatedCart });

    } catch (error) {
        console.error("Error adding item to cart:", error);
        res.status(500).json({ message: "Failed to add item to cart.", error: error.message });
    }
};

exports.removeItemFromCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const productId = req.params.productId;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found for user." });
        }

        cart.items = cart.items.filter(item => !item.productId.equals(productId));
        await cart.save();
        const populatedCart = await cart.populate('items.productId'); // Populate after save
        res.status(200).json({ message: "Product removed from cart!", cart: populatedCart });

    } catch (error) {
        console.error("Error removing item from cart:", error);
        res.status(500).json({ message: "Failed to remove item from cart.", error: error.message });
    }
};

exports.clearCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found for user." });
        }

        cart.items = [];
        await cart.save();
        res.status(200).json({ message: "Cart cleared!", cart: { items: [] } }); // Return cleared cart

    } catch (error) {
        console.error("Error clearing cart:", error);
        res.status(500).json({ message: "Failed to clear cart.", error: error.message });
    }
};