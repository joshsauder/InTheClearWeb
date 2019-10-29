const mongoose = require('mongoose')
const User = require('../model/user')
const jwt = require('jsonwebtoken')

const secret = process.env.JWT_SECRET

exports.createUser = function(req, res){

    let newUser = new User(req.body);

    //save the new user
    newUser.save((err) => {
        if(err){
            res.status(500).send("Error create user")
        }
        else {res.send("success")}
    })

}

exports.signInUser = function(req, res){

    let userAuth = new User(req.body);

    //find user
    User.findOne({ username: userAuth.username}, function(err, user){
        if(err) res.status(500).send("Server error")
        if(!user){res.status(500).send("User not found")}

        //compare password
        user.comparePassword(userAuth.password, function(err, isMatch){
            if(!isMatch){ res.status(500).send("Incorrect Password") }
            else{

                const payload = {username: userAuth.username}
                const token = jwt.sign(payload, secret, {
                    expiresIn: '1h'
                  });
                console.log(token)
                res.cookie('token', token, { httpOnly: true })
                //send frontend api key on callback since the key will be exposed in .env on frontend.
                //https://create-react-app.dev/docs/adding-custom-environment-variables/
                res.json({api_KEY: process.env.GOOGLE_MAPS_FRONTEND_KEY})
            }
        })
    })
}

exports.updateUser = function(req, res){

    let updatedUser = req.body

    User.updateOne({ username: req.params.username}, updatedUser, function(err, user){

        if(err) res.status(500).send("Issue updating user!")
        else{
            res.send("success")
        }
    })
}