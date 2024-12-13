
const express = require('express');
const dashboardRoute = require('./dashboard.js');

const router = express.Router();

router.use('/campaigns',dashboardRoute);

module.exports = router;