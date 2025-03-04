// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

/**
 * @openapi
 * /api/v1/payment/checkout:
 *   post:
 *     tags:
 *       - Payment
 *     summary: Checkout and confirm order for all items in user's cart after MetaMask payment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userAddress
 *               - transactionHash
 *               - totalAmountPaid
 *             properties:
 *               userAddress:
 *                 type: string
 *                 description: User's MetaMask address for the order payment
 *               transactionHash:
 *                 type: string
 *                 description: Blockchain transaction hash for payment verification
 *               totalAmountPaid:
 *                 type: number
 *                 format: float
 *                 description: Total amount paid for the cart (must match cart total)
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
 *                   example: Order confirmed and payment processed successfully!
 *                 orderId:
 *                   type: string
 *                   description: Generated Order ID
 *       400:
 *         description: Bad Request - required parameters missing, invalid transaction, or empty cart
 *       404:
 *         description: Not Found - User not found
 *       500:
 *         description: Server error during checkout
 */
router.post('/checkout', paymentController.checkoutCart); // POST /api/v1/payment/checkout

module.exports = router;