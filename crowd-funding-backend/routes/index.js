const express = require('express');
const bodyParser = require('body-parser');
const userRoute = require('./user/index.js');
const campaignRoute = require('./campaign/index.js');
const dashboardRoute = require('./dashboard/index.js');
const backerRoute = require('./backer/index.js');
const paymentRoute = require('./payment/index.js');
const AdminRoute = require('./admin/index.js');

const router = express.Router();


router.use(bodyParser.json());


router.use('/user',userRoute);
router.use('/campaign',campaignRoute);
router.use('/dashboard',dashboardRoute);
router.use('/backer',backerRoute);
router.use('/payment',paymentRoute);
router.use('/admin',AdminRoute);

module.exports = router;