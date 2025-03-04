// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const jwtAuthMiddleware = require('../middleware/jwtAuthMiddleware'); // Import JWT auth middleware

/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user with email, username, password, and MetaMask address
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - address  # **Thêm 'address' vào danh sách required**
 *             properties:
 *               username:
 *                 type: string
 *                 description: Desired username for registration
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address for registration
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Password for registration (minimum 6 characters)
 *               address:  # **Thêm trường 'address' vào properties**
 *                 type: string
 *                 description: MetaMask address of the user
 *     responses:
 *       201:
 *         description: Success response when user is registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully!
 *                 user:
 *                   type: object
 *                   description: Newly registered user object (safe fields, including address) # **Cập nhật description**
 *       400:
 *         description: Bad request (e.g., missing fields, invalid email format)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Username, email, password, and address are required for registration. # **Cập nhật thông báo lỗi**
 *       409:
 *         description: Conflict - Username, email, or address already exists # **Cập nhật thông báo lỗi**
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Username already exists.
 *       500:
 *         description: Server error during registration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to register user.
 */
router.post('/register', authController.registerUser);

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login user with email and password and get JWT tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address for login
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Password for login
 *     responses:
 *       200:
 *         description: Success response - login successful, returns JWT access and refresh tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful!
 *                 accessToken:
 *                   type: string
 *                   description: JWT access token (short-lived)
 *                 refreshToken:
 *                   type: string
 *                   description: JWT refresh token (long-lived)
 *                 user:
 *                   type: object
 *                   description: Logged-in user object (safe fields)
 *       401:
 *         description: Unauthorized - Invalid email or password
 *       400:
 *         description: Bad request (e.g., missing email or password)
 *       500:
 *         description: Server error during login
 */
router.post('/login', authController.loginUser);

/**
 * @openapi
 * /api/v1/auth/logout:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Logout the current user (client-side action for JWT)
 *     responses:
 *       200:
 *         description: Success response - logout successful (client-side action)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logout successful!
 *       500:
 *         description: Server error during logout (if any backend logout logic)
 */
router.post('/logout', authController.logoutUser);

/**
 * @openapi
 * /api/v1/auth/refresh-token:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Refresh JWT access token using refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: JWT refresh token to use for refreshing access token
 *     responses:
 *       200:
 *         description: Success response - returns new access token and refresh token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: New JWT access token
 *                 refreshToken:
 *                   type: string
 *                   description: New JWT refresh token (you might choose to also refresh refresh token)
 *       400:
 *         description: Bad Request - refresh token missing
 *       401:
 *         description: Unauthorized - invalid or expired refresh token
 *       500:
 *         description: Server error during token refresh
 */
router.post('/refresh-token', authController.refreshToken); // New refresh token endpoint


/**
 * @openapi
 * /api/v1/auth/me:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Get the current logged-in user's profile (protected by JWT)
 *     security:
 *       - JWTAuth: [] # Use JWTAuth security scheme
 *     responses:
 *       200:
 *         description: Success response - current user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object # You can define a more detailed schema for User profile here
 *               description: Current user profile object (safe fields)
 *       401:
 *         description: Unauthorized - access token is missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Access token not found. Authentication required.
 *       404:
 *         description: Not Found - User not found (internal server error, should not usually happen)
 *       500:
 *         description: Server error during profile retrieval
 */
router.get('/me', jwtAuthMiddleware, authController.getCurrentUser); // **Apply JWT auth middleware to protect this route**


module.exports = router;