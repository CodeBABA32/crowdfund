const jwt = require('jsonwebtoken');
require('dotenv').config();

// Generate JWT token
function generateToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// Middleware to verify JWT token
function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access denied, token missing!' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Add decoded payload to the request
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token!' });
    }
}

module.exports = { generateToken, verifyToken };
