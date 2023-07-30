const express = require('express');
const router = express.Router();
const { isAuthticatedUser} = require("../middleware/auth");
const { processPayment, sendStripeApiKey } = require('../controllers/paymentController');


router.route('/payment/process').post(isAuthticatedUser, processPayment)
module.exports = router; 

router.route('/stripeapikey').get(isAuthticatedUser, sendStripeApiKey);