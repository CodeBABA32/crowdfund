const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./db.js');  
const path = require('path');
const routes = require('./routes/index.js'); 
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;  

// Middleware
app.use(bodyParser.json());

app.use(cors({ origin: 'http://localhost:3000' })); // Allow requests from React


// Use the routes from routes/index.js
app.use('/api', routes);  // All routes prefixed with '/api'

// Route to test the server
app.get('/', (req, res) => {
    res.send('Welcome to the Crowdfunding API!');
});

// Route to test database connection
app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');  // Query to check the current time in the database
        res.json({ message: 'Database connected successfully!', serverTime: result.rows[0] });
    } catch (err) {
        console.error('Database connection error:', err);
        res.status(500).json({ error: 'Database connection failed' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
