const express = require('express');
const signupRoute = require('./signup.js');
const signinRoute = require('./signin.js');
const deleteUserRoute = require('./deleteuser.js');
const updateUserRoute = require('./updateuser.js');
const getUserRoute = require('./getusers.js');
const userDetailsRoute = require('./userDetails.js');

const router = express.Router();

router.use('/signup', signupRoute);
router.use('/signin', signinRoute);
router.use('/get', getUserRoute);
router.use('/update', updateUserRoute);
router.use('/delete', deleteUserRoute);
router.use('/details',userDetailsRoute);

module.exports = router;
