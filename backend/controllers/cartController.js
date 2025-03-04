// controllers/cartController.js
const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
    try {
        const userId = req.session.userId; // Get userId from session
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated." }); // 401 Unauthorized if not logged in
        }

        let cart = await Cart.findOne({ userId: userId }).populate('items.productId'); // Populate product details in cart items

        if (!cart) {
            // If no cart exists for the user, create a new one
            cart = new Cart({ userId: userId, items: [] });
            await cart.save();
        }

        res.json(cart);

    } catch (error) {
        console.error("Error getting cart:", error);
        res.status(500).json({ message: "Failed to retrieve cart.", error: error.message });
    }
};


exports.addItemToCart = async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated." });
        }

        const { productId, quantity = 1 } = req.body; // Default quantity to 1 if not provided

        if (!productId) {
            return res.status(400).json({ message: "Product ID is required to add to cart." });
        }
        if (quantity <= 0) {
            return res.status(400).json({ message: "Quantity must be greater than zero." });
        }

        const product = await Product.findById(productId); // Find product by MongoDB ObjectId (_id)
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }
        if (!product.isAvailable || product.stockQuantity < quantity) {
            return res.status(400).json({ message: "Product is currently unavailable or out of stock." });
        }


        let cart = await Cart.findOne({ userId: userId });

        if (!cart) {
            cart = new Cart({ userId: userId, items: [] });
        }

        const cartItemIndex = cart.items.findIndex(item => item.productId.equals(productId)); // Compare ObjectIds

        if (cartItemIndex > -1) {
            // Item already in cart, update quantity
            cart.items[cartItemIndex].quantity += quantity;
        } else {
            // Item not in cart, add new item
            cart.items.push({ productId: productId, quantity: quantity });
        }

        await cart.save();
        await cart.populate('items.productId'); // Repopulate product details after save

        res.status(200).json({ message: "Product added to cart successfully!", cart: cart });

    } catch (error) {
        console.error("Error adding item to cart:", error);
        res.status(500).json({ message: "Failed to add item to cart.", error: error.message });
    }
};


exports.removeItemFromCart = async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated." });
        }

        const productId = req.params.productId; // Get productId from params

        let cart = await Cart.findOne({ userId: userId });

        if (!cart) {
            return res.status(400).json({ message: "Cart not found for user." }); // Should not happen ideally if cart is created on login/first add
        }

        const cartItems = cart.items.filter(item => !item.productId.equals(productId)); // Filter out the item to remove
        cart.items = cartItems; // Update cart items array

        await cart.save();
        await cart.populate('items.productId'); // Repopulate

        res.status(200).json({ message: "Product removed from cart successfully!", cart: cart });


    } catch (error) {
        console.error("Error removing item from cart:", error);
        res.status(500).json({ message: "Failed to remove item from cart.", error: error.message });
    }
};


exports.clearCart = async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated." });
        }

        let cart = await Cart.findOne({ userId: userId });
        if (!cart) {
            return res.status(400).json({ message: "Cart not found for user." }); // Should not happen ideally
        }

        cart.items = []; // Clear items array
        await cart.save();
        await cart.populate('items.productId'); // Repopulate (though items array is now empty)


        res.status(200).json({ message: "Cart cleared successfully!", cart: cart });


    } catch (error) {
        console.error("Error clearing cart:", error);
        res.status(500).json({ message: "Failed to clear cart.", error: error.message });
    }
};