const express = require('express')
const { getDirections, getCityNamesAndWeather, getTripTimes } = require('../controller/directions')
const { createUser, signInUser, updateUser, checkAuth, signInGoogle, signInApple } = require('../controller/user')
const { addLocation } = require('../controller/location')
const router = express.Router()

//directions api calls
router.get('/directions/:start/:end', getDirections)
router.post('/directions/info', getCityNamesAndWeather)
router.post('/directions/tripTimes', getTripTimes)

//user sign in api calls
router.get('/user/auth', checkAuth)
router.post('/user/auth/google', signInGoogle)
router.get('/user/auth/apple', signInApple)

router.post('/locations', addLocation)

module.exports = router