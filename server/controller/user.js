const mongoose = require('mongoose')
const user = require('../model/user')

exports.createUser = function(req, res){

    let newUser = new user(req.body);

    newUser.save((err, user) => {
        if(err){
            res.status(500).send("Error create user")
        }
        else {res.send("success")}
    })

}