const express = require('express')
const { getDirections, getCityNamesAndWeather } = require('../controller/directions')
const { createUser, signInUser } = require('../controller/user')
const router = express.Router()

//directions api calls
router.get('/directions/:start/:end', getDirections)
router.post('/directions/info', getCityNamesAndWeather)

//user sign in api calls
router.post('/user', createUser)
router.post('/user/auth', signInUser)


module.exports = router