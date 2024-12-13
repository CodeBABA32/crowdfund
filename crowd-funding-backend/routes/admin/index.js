
const express = require('express');
const AdminRoute = require('./admin.js');

const router = express.Router();

router.use('/',AdminRoute);

module.exports = router;