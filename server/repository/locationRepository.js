const mongoose = require('mongoose')
const Location = require('../model/locations')

exports.saveLocation = function(location){
    return location.insertMany(locations)
}