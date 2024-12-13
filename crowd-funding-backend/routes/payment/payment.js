const express = require('express');
const pool = require('../../db.js');
const router = express.Router();

// Function to create a new payment with transaction handling and balance deduction
router.post('/', async (req, res) => {
  const { campaignID, userID, amount, paymentMethod, paymentStatus } = req.body;
  const paymentDate = new Date(Date.now());
  if (!campaignID || !userID || !amount || !paymentDate || !paymentMethod || !paymentStatus) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const connection = await pool.getConnection();
  try {
    // Start a transaction
    await connection.beginTransaction();

    // Step 1: Check if the user has sufficient balance
    const [userResult] = await connection.execute(
      `SELECT CurrentAmount FROM campaign WHERE CampaignID = ? FOR UPDATE`,
      [campaignID]
    );

    if (userResult.length === 0) {
      throw new Error('User not found');
    }

    const userBalance = userResult[0].balance;
    if (userBalance < amount) {
      throw new Error('Insufficient balance');
    }

    // Step 2: Deduct the amount from the user's balance
    await connection.execute(
      `UPDATE campaign SET CurrentAmount = CurrentAmount + ? WHERE CampaignID = ?`,
      [amount, campaignID]
    );

    // Step 3: Insert the payment record
    const query = `
      INSERT INTO Payment (campaignID, userID, amount, paymentDate, paymentMethod, paymentStatus)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await connection.execute(query, [
      campaignID,
      userID,
      amount,
      paymentDate,
      paymentMethod,
      paymentStatus,
    ]);

    const paymentID = result.insertId;

    // Step 4: Commit the transaction
    await connection.commit();

    // Respond with the newly created payment record
    res.status(201).json({
      message: 'Payment successful!',
      payment: {
        paymentID,
        campaignID,
        userID,
        amount,
        paymentDate,
        paymentMethod,
        paymentStatus,
      },
    });
  } catch (err) {
    // Rollback transaction on error
    await connection.rollback();
    console.error('Error processing payment:', err);
    res.status(500).json({ message: err.message });
  } finally {
    // Release the connection
    connection.release();
  }
});

// Example: Get all payments for a user
router.get('/user/:userID', async (req, res) => {
  const { userID } = req.params;

  try {
    const query = 'SELECT * FROM Payment WHERE userID = ?';
    const [results] = await pool.execute(query, [userID]);
    res.status(200).json({ payments: results });
  } catch (err) {
    console.error('Error retrieving payments:', err);
    res.status(500).json({ message: 'Error retrieving payments', error: err.message });
  }
});

module.exports = router;
