const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next(); // Proceed to the next middleware or route handler
    } else {
        return res.status(401).json({ message: "Authentication required. Please log in." }); 
    }
};

module.exports = isAuthenticated;