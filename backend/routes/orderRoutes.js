// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const jwtAuthMiddleware = require('../middleware/jwtAuthMiddleware');

router.use(jwtAuthMiddleware)

/**
 * @openapi
 * /api/v1/orders/confirm:
 *   post:
 *     tags:
 *       - Orders
 *     summary: Confirm a new order after successful MetaMask payment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productIdList
 *               - userAddress
 *               - transactionHash
 *               - totalAmountPaid
 *             properties:
 *               productIdList:
 *                 type: array
 *                 items:
 *                   type: string # Assuming productId is sent as string (or adjust to number if needed)
 *                 description: List of Product IDs in the order
 *               userAddress:
 *                 type: string
 *                 description: User's MetaMask address for the order
 *               transactionHash:
 *                 type: string
 *                 description: Blockchain transaction hash for payment verification
 *               totalAmountPaid:
 *                 type: number
 *                 format: float
 *                 description: Total amount paid for the order
 *     responses:
 *       201:
 *         description: Success response - order confirmation details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order confirmed and saved successfully!
 *                 orderId:
 *                   type: string
 *                   description: Generated Order ID
 *       400:
 *         description: Bad Request - required parameters missing or invalid transaction
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Missing required order confirmation data.
 *       404:
 *         description: Not Found - User or Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found.
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to confirm order.
 */
router.post('/confirm', orderController.confirmOrder); // No auth middleware for /confirm


/**
 * @openapi
 * /api/v1/orders/history:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get order history for the logged-in user
 *     security:
 *       - JWTAuth: [] # Assuming JWTAuth security scheme is defined
 *     responses:
 *       200:
 *         description: Success response - array of user's order objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object # You can define a more detailed schema for Order here
 *                 description: Order object
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
 *         description: Not Found - User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found.
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to get order history.
 */
router.get('/history', orderController.getOrderHistoryForUser);

/**
 * @openapi
 * /api/v1/orders/{orderId}:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get details of a specific order by Order ID
 *     security:
 *       - JWTAuth: [] # Assuming JWTAuth security scheme is defined
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: ID of the order to fetch
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success response - order object with details
 *         content:
 *           application/json:
 *             schema:
 *               type: object # You can define a more detailed schema for Order here
 *               description: Order object
 *       401:
 *         description: Unauthorized - authentication required (adjust security as needed)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Authentication required.
 *       404:
 *         description: Not Found - Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order not found.
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to fetch order details.
 */
router.get('/:orderId', orderController.getOrderDetails);

module.exports = router;