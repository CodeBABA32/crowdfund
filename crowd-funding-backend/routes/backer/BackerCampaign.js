const express = require('express');
const pool = require('../../db.js'); // Ensure this imports your database pool correctly
const router = express.Router();

// Add a new backer campaign
router.post('/', async (req, res) => {
    console.log(req.body);
    const { firstName, lastName, title, amountDonated } = req.body;

    // Validate input fields
    if (!firstName || !lastName || !title || amountDonated === undefined) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (amountDonated <= 0) {
        return res.status(400).json({ message: 'Amount donated must be greater than zero' });
    }

    let connection;
    try {
        // Get a connection from the pool
        connection = await pool.getConnection();

        // Start the transaction
        await connection.beginTransaction();

        const query = `
            INSERT INTO BackerCampaign (firstName, lastName, title, amountDonated)
            VALUES (?, ?, ?, ?)
        `;

        const values = [firstName, lastName, title, amountDonated];
        const [result] = await connection.query(query, values);

        // Commit the transaction
        await connection.commit();

        res.status(201).json({
            message: 'Backer Campaign record added successfully',
            backerCampaign: { backerCampaignID: result.insertId, firstName, lastName, title, amountDonated },
        });
    } catch (error) {
        // Rollback the transaction in case of any error
        if (connection) await connection.rollback();

        console.error('Error adding backer campaign:', error);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Duplicate entry. Campaign already exists.' });
        }

        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        // Release the database connection
        if (connection) connection.release();
    }
});

// Get all backer campaigns
router.get('/', async (req, res) => {
    try {
        const query = `SELECT * FROM BackerCampaign;`;
        const [result] = await pool.query(query);

        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching backer campaigns:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
