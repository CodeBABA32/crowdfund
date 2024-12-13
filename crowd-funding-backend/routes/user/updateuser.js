const express = require('express');
const pool = require('../../db.js'); // Database connection
const router = express.Router();

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { username, email, first_name, last_name, contact_info } = req.body;

    try {
        // Update the user in the database
        const updateQuery = `
            UPDATE users
            SET 
                username = ?,
                email = ?,
                first_name = ?,
                last_name = ?,
                contact_info = ?
            WHERE id = ?;
        `;
        const updateValues = [username, email, first_name, last_name, contact_info, id];
        const [updateResult] = await pool.query(updateQuery, updateValues);

        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch the updated user
        const selectQuery = 'SELECT * FROM users WHERE id = ?';
        const [user] = await pool.query(selectQuery, [id]);

        res.status(200).json({
            message: 'User updated successfully',
            user: user[0],
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
