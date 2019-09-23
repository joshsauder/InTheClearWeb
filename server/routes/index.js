const express = require('express')
const { getDirections } = require('../controller/directions')
const router = express.Router()

router.get('/directions/:start/:end', getDirections)

module.exports = router