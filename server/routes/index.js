const express = require('express')
const { getDirections, getCityNamesAndWeather } = require('../controller/directions')
const router = express.Router()

router.get('/directions/:start/:end', getDirections)
router.post('/directions/info', getCityNamesAndWeather)

module.exports = router