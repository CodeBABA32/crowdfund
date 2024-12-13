const express = require('express');
const db = require('../../db.js');

const router = express.Router();

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const {
        title,
        description,
        goalAmount,
        category,
        status,
        endDate
    } = req.body;
    const query = `
        UPDATE Campaign 
        SET 
            Title = ?,
            Description = ?, 
            GoalAmount = ?, 
            Category = ?, 
            Status = ?, 
            EndDate = ?
        WHERE CampaignID = ?;
    `;

    try {
        const [result] = await db.execute(query, [
            title,
            description,
            goalAmount,
            category,
            status,
            endDate,
            id
        ]);

        if (result.affectedRows > 0) {
            res.status(200).json({ success: true, message: 'Campaign updated successfully.' });
        } else {
            res.status(404).json({ success: false, message: 'Campaign not found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'An error occurred while updating the campaign.' });
    }
});

module.exports = router;
