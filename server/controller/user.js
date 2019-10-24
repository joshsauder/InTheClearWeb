const mongoose = require('mongoose')
const user = require('../model/user')

exports.createUser = function(req, res){

    let newUser = new user(req.body);
    console.log(newUser)

    newUser.save((err, user) => {
        if(err){
            res.status(400).send("Error create user")
        }
        else {res.send("success")}
    })

}