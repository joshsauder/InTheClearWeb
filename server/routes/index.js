const express = require('express')
const { getDirections, getCityNamesAndWeather } = require('../controller/directions')
const { createUser, signInUser } = require('../controller/user')
const router = express.Router()

router.get('/directions/:start/:end', getDirections)
router.post('/directions/info', getCityNamesAndWeather)

router.post('/user', createUser)
router.post('/user/auth', signInUser)


module.exports = router