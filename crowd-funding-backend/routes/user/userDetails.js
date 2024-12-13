const express = require('express');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2'); // Import the standard mysql2 library
const router = express.Router();

// Import the global pool (non-promise based)
const { pool } = require('../../db.js');

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Extract token
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
        req.userId = decoded.id; // Add userId to request object for later use
        next(); // Proceed to the next middleware or route handler
    });
};

// Fetch user details
router.get('/', verifyToken, async (req, res) => {
    try {
        const userId = req.userId; // userId is set by the verifyToken middleware

        // Wrap standard pool in a promise manually
        const promisePool = pool.promise(); // Create a promise-based wrapper for the query

        // Query to get user details by userId
        const [rows] = await promisePool.query('SELECT * FROM users WHERE id = ?', [userId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(rows[0]); // Return the first user as JSON
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
