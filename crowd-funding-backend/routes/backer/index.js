const express = require('express');
const backer = require('./BackerCampaign.js');
const router = express.Router();



router.use('/add',backer);

module.exports = router;