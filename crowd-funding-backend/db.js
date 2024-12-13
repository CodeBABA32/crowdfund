const mysql = require('mysql2');

require('dotenv').config(); 

const pool = mysql.createPool({
    user: process.env.DB_USER,          
    host: process.env.DB_HOST,          
    database: process.env.DB_NAME,      
    password: process.env.DB_PASSWORD,  
//    port: process.env.DB_PORT,  
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0        
}).promise();;

// Function to check the database connection
pool.getConnection()
    .then(connection => {
        console.log("Connected to MySQL Database");
        connection.release(); // Release the connection back to the pool
    })
    .catch(err => {
        console.error("Database connection error:", err.message);
    });
// Export the pool to use in other files
module.exports = pool;