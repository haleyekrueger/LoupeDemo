const jwt = require('jsonwebtoken');

// Middleware to authenticate requests
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Extract token from header

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Attach decoded user to request

        console.log("Decoded User:", verified); // ✅ Debugging step
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Invalid token' });
    }
};

module.exports = authenticateToken;
