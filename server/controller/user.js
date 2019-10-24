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

exports.signInUser = function(req, res){

    let userAuth = new user(req.body);

    user.findOne({ username: userAuth.username}, function(err, user){
        if(err) res.status(500).send("User does not exist")

        user.comparePassword(userAuth.password, function(err, isMatch){
            if(!isMatch){ res.status(500).send("Incorrect Password") }
            else{
                res.send("success")
            }
        })
    })
}