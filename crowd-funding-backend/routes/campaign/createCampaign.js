const jwt = require('jsonwebtoken');
require('dotenv').config();
const pool = require('../../db.js');

const createCampaign = async (req, res) => {
  console.log(req.body);
  const {
    Title,
    userID,
    Description,
    GoalAmount,
    Category,
    StartDate,
    EndDate,
  } = req.body;

  if (!Title || !userID || !Description || !GoalAmount || !Category || !StartDate || !EndDate) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const connection = await pool.getConnection(); 
  try {
  
    await connection.beginTransaction();

    // Generate CampaignID using JWT
    const CampaignID = jwt.sign(
      { title: Title, timestamp: Date.now() },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    const [rows] = await connection.query(
      'SELECT campaigns FROM users WHERE id = ?',
      [userID]
    );
    if (rows.length === 0) {
      throw new Error('User not found');
    }
    let campaigns = JSON.parse(rows[0].campaigns || '[]');
    campaigns.push(CampaignID);
    // SQL query to insert data into the Campaign table
    const query = `
      INSERT INTO campaign (
        CampaignID,userID, Title, Description, GoalAmount, CurrentAmount, 
        Category, Status, StartDate, EndDate
      ) VALUES (?, ?,?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const values = [
      CampaignID,
      userID,
      Title,
      Description,
      GoalAmount,
      0, // Initial CurrentAmount is 0
      Category,
      'Active', // Default Status is Active
      StartDate,
      EndDate,
    ];

    // Execute query (triggers will validate EndDate against StartDate)
    await connection.query(query, values);
    await connection.query(
      'UPDATE users SET campaigns = ? WHERE id = ?',
      [JSON.stringify(campaigns), userID]
    );

    // Commit the transaction
    await connection.commit();

    // Fetch the inserted row to return it
    const [result] = await connection.query('SELECT * FROM campaign WHERE CampaignID = ?', [CampaignID]);
    console.log(result[0]);

    return res.status(201).json({ 
      message: 'Campaign created successfully', 
      campaign: result[0], 
    });
  } catch (error) {
    // Handle specific database validation error from trigger
    if (error.sqlState === '45000') {
      return res.status(400).json({ message: error.sqlMessage });
    }

    // Rollback transaction on other errors
    await connection.rollback();
    console.error('Error creating campaign:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    // Release the connection
    connection.release();
  }
};

module.exports = createCampaign;
