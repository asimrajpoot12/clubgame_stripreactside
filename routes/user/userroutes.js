const express = require('express')
const {paymentIntent,storeData} = require('../../controllers/paymentController/paymentController')
const { resetPassword } = require('../../controllers/userController/userController')


const router = express.Router()
router.route('/payment').post(paymentIntent)
router.route('/store').post(storeData)
router.route('/reset-password').post(resetPassword)


module.exports = router