// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Hàm tạo JWT Access Token
const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: '15m' // Thời hạn access token (ví dụ 15 phút)
    });
};

// Hàm tạo JWT Refresh Token
const generateRefreshToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '7d' // Thời hạn refresh token (ví dụ 7 ngày)
    });
};

exports.registerUser = async (req, res) => {
    try {
        const { username, email, password, address } = req.body; // **Lấy thêm trường 'address' từ request body**
        console.log("Bắt đầu đăng ký user:", { username, email, address }); // Log đầu vào (thêm address)

        // Validate input data - Thêm validation cho address
        if (!username || !email || !password || !address) { // **Thêm address vào danh sách required fields**
            console.log("Lỗi: Thiếu username, email, password hoặc address"); // Log lỗi validation (thêm address)
            return res.status(400).json({ message: "Username, email, password, and address are required for registration." }); // **Cập nhật thông báo lỗi**
        }

        // Kiểm tra username, email, và address đã tồn tại
        const existingUserUsername = await User.findOne({ username: username });
        if (existingUserUsername) {
            console.log("Lỗi: Username đã tồn tại:", username);
            return res.status(409).json({ message: "Username already exists." });
        }
        const existingUserEmail = await User.findOne({ email: email });
        if (existingUserEmail) {
            console.log("Lỗi: Email đã tồn tại:", email);
            return res.status(409).json({ message: "Email already exists." });
        }
        const existingUserAddress = await User.findOne({ address: address.toLowerCase() }); // **Kiểm tra address đã tồn tại**
        if (existingUserAddress) {
            console.log("Lỗi: Address đã tồn tại:", address); // Log lỗi address tồn tại
            return res.status(409).json({ message: "Address already exists." }); // **Lỗi nếu address đã được đăng ký**
        }


        console.log("Tạo newUser object:", { username, email, address }); // Log (thêm address)
        const newUser = new User({
            username: username,
            email: email.toLowerCase(),
            password: password,
            address: address.toLowerCase(), // **Lưu address vào document User**
        });

        console.log("Lưu newUser vào database...");
        await newUser.save();
        console.log("Lưu newUser thành công!");

        res.status(201).json({ message: "User registered successfully!", user: { _id: newUser._id, username: newUser.username, email: newUser.email, address: newUser.address } }); // **Trả về address trong response**
        console.log("Trả về response 201");

    } catch (error) {
        console.error("Lỗi trong hàm registerUser:", error);
        if (error.name === 'ValidationError') {
            console.log("Lỗi validation Mongoose:", error.errors);
            return res.status(400).json({ message: "Validation error during registration.", errors: error.errors });
        }
        res.status(500).json({ message: "Failed to register user.", error: error.message });
        console.log("Trả về response 500");
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required for login." });
        }

        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        // Tạo Access Token và Refresh Token
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Trả về access token và refresh token trong response
        res.status(200).json({
            message: "Login successful!",
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: { _id: user._id, username: user.username, email: user.email } // Trả về thông tin user (không bao gồm password)
        });

    } catch (error) { /* ... (Error handling - giữ nguyên) ... */ }
};

exports.logoutUser = (req, res) => {
    // Logout (client-side action chủ yếu với JWT, backend có thể không cần xử lý nhiều)
    res.status(200).json({ message: "Logout successful!" });
};

exports.getCurrentUser = async (req, res) => {
    try {
        // Middleware jwtAuthMiddleware đã xác thực và đính kèm user vào req.user
        const user = await User.findById(req.user.userId).select('-password'); // Lấy user từ database dựa trên userId từ JWT payload
        if (!user) {
            return res.status(404).json({ message: "User not found." }); // Should not happen if middleware is correct
        }
        res.status(200).json({ user: user });
    } catch (error) { /* ... (Error handling - giữ nguyên) ... */ }
};

exports.refreshToken = async (req, res) => {
    try {
        const refreshToken = req.body.refreshToken;

        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh token is required." });
        }

        // Xác minh refresh token
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Invalid refresh token." }); // Refresh token không hợp lệ hoặc hết hạn
            }

            const userId = decoded.userId;

            // Kiểm tra xem user có tồn tại (tùy chọn, nhưng nên làm)
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found for refresh token." });
            }

            // Tạo access token và refresh token mới
            const newAccessToken = generateAccessToken(userId);
            const newRefreshToken = generateRefreshToken(userId);

            res.status(200).json({
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            });
        });

    } catch (error) {
        console.error("Error refreshing token:", error);
        res.status(500).json({ message: "Failed to refresh token.", error: error.message });
    }
};