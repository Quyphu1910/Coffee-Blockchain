// middleware/jwtAuthMiddleware.js
const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Lấy token từ header Authorization: Bearer <token>

    if (!token) {
        return res.status(401).json({ message: "Access token not found. Authentication required." }); // 401 Unauthorized - No token
    }

    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
        if (err) {
            console.error("JWT Verification Error:", err);
            return res.status(403).json({ message: "Invalid or expired access token." }); // 403 Forbidden - Invalid token
        }

        // Token hợp lệ, thông tin user đã được giải mã trong 'decoded'
        req.user = decoded; // Đính kèm thông tin user vào req.user để controller có thể truy cập
        next(); // Cho phép request đi tiếp
    });
};

module.exports = jwtAuthMiddleware;