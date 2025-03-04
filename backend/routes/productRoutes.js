// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @openapi
 * /api/products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get a list of all available products
 *     responses:
 *       200:
 *         description: Success response - array of product objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object # You can define a more detailed schema for Product here if needed
 *                 description: Product object
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to fetch products.
 */
router.get('/', productController.getAllProducts);

/**
 * @openapi
 * /api/products/{productId}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get product details by Product ID
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: ID of the product to fetch
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Success response - product object
 *         content:
 *           application/json:
 *             schema:
 *               type: object # You can define a more detailed schema for Product here
 *               description: Product object
 *       404:
 *         description: Not Found - Product not found or unavailable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product not found or is unavailable.
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to fetch product details.
 */
router.get('/:productId', productController.getProductById);

router.use(authMiddleware); // Apply admin middleware to the routes below

/**
 * @openapi
 * /api/products:
 *   post:
 *     tags:
 *       - Products (Admin)
 *     summary: Create a new product (Admin only)
 *     security:
 *       - JWTAuth: [] # Assuming you have defined JWTAuth security scheme
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - imageBase64
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the product
 *               description:
 *                 type: string
 *                 description: Detailed description of the product
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Price of the product
 *               category:
 *                 type: string
 *                 description: Category of the product
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of tags for the product
 *               stockQuantity:
 *                 type: number
 *                 description: Initial stock quantity
 *               discountPercentage:
 *                 type: number
 *                 format: float
 *                 description: Discount percentage (0-100)
 *               imageBase64:
 *                 type: string
 *                 description: Base64 encoded image of the product
 *     responses:
 *       201:
 *         description: Success response - newly created product object
 *         content:
 *           application/json:
 *             schema:
 *               type: object # You can define a more detailed schema for Product here
 *               description: Newly created product object
 *       400:
 *         description: Bad Request - required fields missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product name, price, and image are required.
 *       401:
 *         description: Unauthorized - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin access required.
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to create product.
 */
router.post('/', productController.createProduct);

/**
 * @openapi
 * /api/products/{productId}:
 *   put:
 *     tags:
 *       - Products (Admin)
 *     summary: Update an existing product (Admin only)
 *     security:
 *       - JWTAuth: [] # Assuming JWTAuth security scheme is defined
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: ID of the product to update
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the product
 *               description:
 *                 type: string
 *                 description: Updated description
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Updated price
 *               category:
 *                 type: string
 *                 description: Updated category
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Updated array of tags
 *               stockQuantity:
 *                 type: number
 *                 description: Updated stock quantity
 *               discountPercentage:
 *                 type: number
 *                 format: float
 *                 description: Updated discount percentage (0-100)
 *               imageBase64:
 *                 type: string
 *                 description: Base64 encoded image for updating product image (optional)
 *     responses:
 *       200:
 *         description: Success response - updated product object
 *         content:
 *           application/json:
 *             schema:
 *               type: object # You can define a more detailed schema for Product here
 *               description: Updated product object
 *       400:
 *         description: Bad Request - invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid input data.
 *       401:
 *         description: Unauthorized - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin access required.
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
 *                   example: Failed to update product.
 */
router.put('/:productId', productController.updateProduct);

/**
 * @openapi
 * /api/products/{productId}:
 *   delete:
 *     tags:
 *       - Products (Admin)
 *     summary: Delete a product (Admin only - soft delete)
 *     security:
 *       - JWTAuth: [] # Assuming JWTAuth security scheme is defined
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: ID of the product to delete
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Success response - product deleted message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product deleted successfully (soft delete).
 *       401:
 *         description: Unauthorized - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin access required.
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
 *                   example: Failed to delete product.
 */
router.delete('/:productId', productController.deleteProduct);

module.exports = router;