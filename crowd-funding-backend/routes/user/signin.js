const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../../db.js');

const router = express.Router();

// Secret Key for JWT
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to verify JWT token
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }

        req.userId = decoded.id;
        next();
    });
}

// Route: Public (Testing Purpose)
router.get('/', async (req, res) => {
    res.json({ message: "signin" });
});

// Route: Signin
router.post('/', async (req, res) => {
    console.log(req.body);
    const { username, email, password } = req.body;

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [users] = await connection.query(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [username || null, email || null]
        );

        if (users.length === 0) {
            await connection.rollback();
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, users[0].password);
        if (!validPassword) {
            await connection.rollback();
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        await connection.query(
            `INSERT INTO logins (user_id) VALUES (?)`,
            [users[0].id]
        );

        await connection.commit();

        // Generate JWT token
        const token = jwt.sign({ id: users[0].id, username: users[0].username }, JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({ message: 'Signin successful', token });
    } catch (err) {
        await connection.rollback();
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    } finally {
        connection.release();
    }
});


router.get('/protected', verifyToken, async (req, res) => {
    res.status(200).json({ message: `Access granted. User ID: ${req.userId}` });
});

module.exports = router;
