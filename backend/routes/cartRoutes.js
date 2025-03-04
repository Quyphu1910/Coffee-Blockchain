// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const jwtAuthMiddleware = require('../middleware/jwtAuthMiddleware');

router.use(jwtAuthMiddleware) // Apply auth middleware to protect cart routes

/**
 * @openapi
 * /api/cart:
 *   get:
 *     tags:
 *       - Cart
 *     summary: Get the current user's shopping cart
 *     security:
 *       - JWTAuth: [] # Assuming JWTAuth security scheme is defined
 *     responses:
 *       200:
 *         description: Success response - shopping cart object
 *         content:
 *           application/json:
 *             schema:
 *               type: object # You can define a more detailed schema for Cart here
 *               description: Shopping cart object
 *       401:
 *         description: Unauthorized - authentication required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Authentication required. Please log in.
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to retrieve cart.
 */
router.get('/', cartController.getCart);

/**
 * @openapi
 * /api/cart/add:
 *   post:
 *     tags:
 *       - Cart
 *     summary: Add a product to the user's shopping cart
 *     security:
 *       - JWTAuth: [] # Assuming JWTAuth security scheme is defined
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *                 description: MongoDB ObjectId of the product to add
 *               quantity:
 *                 type: number
 *                 description: Quantity of the product to add (optional, default 1)
 *     responses:
 *       200:
 *         description: Success response - updated cart object
 *         content:
 *           application/json:
 *             schema:
 *               type: object # You can define a more detailed schema for Cart here
 *               description: Updated cart object
 *       400:
 *         description: Bad Request - productId missing or invalid quantity
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product ID is required to add to cart.
 *       401:
 *         description: Unauthorized - authentication required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Authentication required. Please log in.
 *       404:
 *         description: Not Found - Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product not found.
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to add item to cart.
 */
router.post('/add', cartController.addItemToCart);

/**
 * @openapi
 * /api/cart/remove/{productId}:
 *   delete:
 *     tags:
 *       - Cart
 *     summary: Remove a specific product from the user's shopping cart
 *     security:
 *       - JWTAuth: [] # Assuming JWTAuth security scheme is defined
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: MongoDB ObjectId of the product to remove
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success response - updated cart object
 *         content:
 *           application/json:
 *             schema:
 *               type: object # You can define a more detailed schema for Cart here
 *               description: Updated cart object
 *       401:
 *         description: Unauthorized - authentication required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Authentication required. Please log in.
 *       404:
 *         description: Not Found - Cart not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cart not found for user.
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to remove item from cart.
 */
router.delete('/remove/:productId', cartController.removeItemFromCart);

/**
 * @openapi
 * /api/cart/clear:
 *   delete:
 *     tags:
 *       - Cart
 *     summary: Clear all items from the user's shopping cart
 *     security:
 *       - JWTAuth: [] # Assuming JWTAuth security scheme is defined
 *     responses:
 *       200:
 *         description: Success response - cleared cart object
 *         content:
 *           application/json:
 *             schema:
 *               type: object # You can define a more detailed schema for Cart here
 *               description: Cleared cart object
 *       401:
 *         description: Unauthorized - authentication required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Authentication required. Please log in.
 *       404:
 *         description: Not Found - Cart not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cart not found for user.
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to clear cart.
 */
router.delete('/clear', cartController.clearCart);

module.exports = router;