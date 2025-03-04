// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer');
const jwtAuthMiddleware = require('../middleware/jwtAuthMiddleware');

// Cấu hình multer
const upload = multer({
    limits: {
        fileSize: 5 * 1024 * 1024, // giới hạn 5MB
    },
    fileFilter: (req, file, cb) => {
        console.log('Received file:', file);
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Not an image! Please upload an image.'), false);
        }
    }
});

router.use(jwtAuthMiddleware)
/**
 * @openapi
 * /api/v1/products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get a list of all available products
 *     responses:
 *       200:
 *         description: Success - returns an array of product objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object # Define Product schema if needed in Swagger
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
 * /api/v1/products/{productId}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get product details by Product ID
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: ID of the product to retrieve
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Success - returns the requested product object
 *         content:
 *           application/json:
 *             schema:
 *               type: object # Define Product schema if needed in Swagger
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


/**
 * @openapi
 * /api/v1/products:
 *   post:
 *     tags:
 *       - Products (Admin)
 *     summary: Create a new product (Admin only)
 *     security:
 *       - JWTAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
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
 *                 description: Stock quantity
 *               discountPercentage:
 *                 type: number
 *                 format: float
 *                 description: Discount percentage (0-100)
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Product image file (JPEG, PNG, ...)
 *     responses:
 *       201:
 *         description: Success - product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product created successfully!
 *                 product:
 *                   type: object # Define Product schema if needed
 *                   description: Newly created product object
 *       400:
 *         description: Bad Request - invalid input data
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
router.post('/', upload.single('image'), productController.createProduct); 

/**
 * @openapi
 * /api/v1/products/{productId}:
 *   put:
 *     tags:
 *       - Products (Admin)
 *     summary: Update an existing product (Admin only)
 *     security:
 *       - JWTAuth: []
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
 *         multipart/form-data:
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
 *                 description: Discount percentage (0-100)
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Product image file (JPEG, PNG, ...) - Optional, only include to update image
 *     responses:
 *       200:
 *         description: Success - product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
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
router.put('/:productId', upload.single('image'), productController.updateProduct);

/**
 * @openapi
 * /api/v1/products/{productId}:
 *   delete:
 *     tags:
 *       - Products (Admin)
 *     summary: Delete a product (Admin only - soft delete)
 *     security:
 *       - JWTAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: ID of the product to delete
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Success - product deleted successfully (soft delete)
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