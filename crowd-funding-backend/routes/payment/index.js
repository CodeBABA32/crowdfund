const express = require('express');
const paymentRoute = require('./payment.js');
const getPaymentsRoute = require('./payments.js');
const router = express.Router();



router.use('/add',paymentRoute);
router.use('/get',getPaymentsRoute);


module.exports = router;