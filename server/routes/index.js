const express = require('express')
const { getDirections, getCityNamesAndWeather } = require('../controller/directions')
const { createUser } = require('../controller/user')
const router = express.Router()

router.get('/directions/:start/:end', getDirections)
router.post('/directions/info', getCityNamesAndWeather)

router.post('/user', createUser)


module.exports = router