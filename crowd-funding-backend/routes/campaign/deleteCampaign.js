const express = require('express');
const db = require('../../db.js'); 
const router = express.Router();


router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM Campaign WHERE CampaignID = ?;`;

    try {
        const [camp] = await db.execute(
            'SELECT userID FROM Campaign WHERE CampaignID = ?',
            [id]
          );
        const [rows] = await db.execute(
            'SELECT campaigns FROM users WHERE id = ?',
            [camp[0].userID]
          );
          if (rows.length === 0) {
            throw new Error('User not found');
          }
          let campaigns = JSON.parse(rows[0].campaigns || '[]');
          campaigns = campaigns.filter(el=>el!=id);
          await db.execute(
            'UPDATE users SET campaigns = ? WHERE id = ?',
            [JSON.stringify(campaigns), camp[0].userID]
          );
        const [result] = await db.execute(query, [id]);

        if (result.affectedRows > 0) {
            res.status(200).json({ success: true, message: 'Campaign deleted successfully.' });
        } else {
            res.status(404).json({ success: false, message: 'Campaign not found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'An error occurred while deleting the campaign.' });
    }
});

module.exports = router;
