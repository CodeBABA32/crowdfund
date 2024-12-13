const express = require('express');
const pool = require('../../db');

const router = express.Router();

// Get Campaign Details by CampaignID
router.get('/:CampaignID', async (req, res) => {
  const { CampaignID } = req.params;

  try {
    // Query to get the campaign details
    const [result] = await pool.query(
      'SELECT * FROM Campaign WHERE CampaignID = ?',
      [CampaignID]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    res.status(200).json({ campaign: result[0] });
  } catch (error) {
    console.error('Error retrieving campaign details:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
