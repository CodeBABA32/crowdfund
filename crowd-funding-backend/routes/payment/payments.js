const express = require('express');
const pool = require('../../db.js');
const router = express.Router();

router.get('/', async (req, res)=>{
    try {
        const query = 'SELECT * FROM Payment';
        const [results] = await pool.execute(query);
        res.status(200).json({ payments: results });
      } catch (err) {
        console.error('Error retrieving payments:', err);
        res.status(500).json({ message: 'Error retrieving payments', error: err.message });
      }
})

module.exports = router;