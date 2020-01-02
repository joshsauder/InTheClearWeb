const express = require('express')
const { getDirections, getCityNamesAndWeather, getTripTimes } = require('../controller/directions')
const {checkAuth, signInGoogle, signInApple, createUser, signInUser } = require('../controller/user')
const { addLocation } = require('../controller/location')
const router = express.Router()

//directions api calls
router.get('/directions/:start/:end', getDirections)
router.post('/directions/info', getCityNamesAndWeather)
router.post('/directions/tripTimes', getTripTimes)

//user sign in api calls
router.post('/user', createUser)
router.post('/user/auth', signInUser)
router.get('/user/auth', checkAuth)
router.post('/user/auth/google', signInGoogle)
router.post('/user/auth/apple', signInApple)

//location routes
router.post('/locations', addLocation)

module.exports = router