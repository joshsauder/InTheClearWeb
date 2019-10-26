const express = require('express')
const { getDirections, getCityNamesAndWeather } = require('../controller/directions')
const { createUser, signInUser, updateUser } = require('../controller/user')
const { addLocation } = require('../controller/location')
const router = express.Router()

//directions api calls
router.get('/directions/:start/:end', getDirections)
router.post('/directions/info', getCityNamesAndWeather)

//user sign in api calls
router.post('/user', createUser)
router.post('/user/auth', signInUser)
router.put('/user/:username', updateUser)

router.post('/locations', addLocation)

module.exports = router