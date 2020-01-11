const User = require('../model/user');
const mongoose = require('mongoose')


exports.saveUser = function(newUser){
    return newUser.save()
}

exports.findUser = function(user){
    return User.findOne({email: req.body.email})
}