const express = require('express');
const pool = require('../../db.js'); 
const router = express.Router();

// Route to fetch campaigns (admin only)
router.get('/campaigns', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Campaign');
    res.status(200).json({ campaigns: rows });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ message: 'Error fetching campaigns' });
  }
});
router.post('/verify', async (req, res) => {
  const pass = req.body.pass;
  try {
    if(pass==="Fast1234")
      res.status(200).json({message: "correct"});
    else
      res.status(200).json({message: "Wrong Password"});

  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Route to fetch users (admin only)
router.get('/users',  async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Users');
    res.status(200).json({ users: rows });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

module.exports = router;
