const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../../db.js');
const { generateToken } = require('../../utils/jwt.js');

const router = express.Router();

// Route for testing
router.get('/', async (req, res) => {
    res.json({ message: "signup" });
});

// Signup Route with Transactions
router.post('/', async (req, res) => {
    const { username, password, email, first_name, last_name, contact_info } = req.body;
    const campaigns = JSON.stringify([]);

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction(); // Start the transaction

        // Check if the user already exists
        const [userExists] = await connection.query(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [username, email]
        );
        if (userExists.length > 0) {
            await connection.rollback(); // Rollback the transaction
            return res.status(400).json({ message: 'Username or Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the user into the database
        const [result] = await connection.query(
            `INSERT INTO users (username, password, email, first_name, last_name, contact_info, campaigns) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [username, hashedPassword, email, first_name, last_name, contact_info, campaigns]
        );

        // The trigger will automatically log the user creation in the user_logs table

        await connection.commit(); // Commit the transaction

        // Generate JWT token
        const token = generateToken({ id: result.insertId, username });

        res.status(201).json({ message: 'User created successfully', token });
    } catch (err) {
        await connection.rollback(); // Rollback transaction on error
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    } finally {
        connection.release(); // Release the connection
    }
});

module.exports = router;
