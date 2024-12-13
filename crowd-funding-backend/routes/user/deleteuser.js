const express = require('express');
const pool = require('../../db.js'); // Database connection
const router = express.Router();


// Delete user
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = `DELETE FROM users WHERE id = ? RETURNING *;`;
        const result = await pool.query(query, [id]);

        if (result.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'User deleted successfully',
            user: result[0],
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router;