const mongoose = require('mongoose')
const User = require('../model/user')
const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.createUser = function(req, res){

    let newUser = new User(req.body);

    //save the new user
    newUser.save((err) => {
        if(err){
            res.status(400).send("Error creating user")
        }
        else {res.send("success")}
    })

}

exports.signInUser = function(req, res){

    let userAuth = new User(req.body);

    //find user
    User.findOne({ username: userAuth.username}, function(err, user){
        if(err) res.status(500).send("Server error")
        else if(!user){res.status(401).send("User not found")}
        else{
            //compare password
            user.comparePassword(userAuth.password, function(err, isMatch){
                if(!isMatch){ res.status(401).send("Incorrect Password") }
                else{

                    const payload = {username: userAuth.username}
                    //create token
                    const token = jwt.sign(payload, secret, {
                        expiresIn: '1h'
                    });
                    res.cookie('token', token, { httpOnly: true })
                    //send frontend api key on callback since the key will be exposed in .env on frontend.
                    //https://create-react-app.dev/docs/adding-custom-environment-variables/
                    res.json({api_KEY: process.env.GOOGLE_MAPS_FRONTEND_KEY})
                }
            })
        }
    })
}

exports.updateUser = function(req, res){

    let updatedUser = req.body

    User.updateOne({ username: req.params.username}, updatedUser, function(err, user){

        //if err or not modified send error
        if(err) res.status(500).send("Server error")
        else{
            res.send("success")
        }
    })
}

exports.checkAuth = function(req, res){

    const token =
    req.body.token ||
    req.query.token ||
    req.headers['x-access-token'] ||
    req.cookies.token;

    console.log(token)

    //verify token is there and valid
    if(!token){
        res.status(401).send("No token... Unauthorized.")
    } else{
        jwt.verify(token, secret, function(err, decoded){
            if(err){
                res.status(401).send("Invalid Token... Unauthorized.")
            }else {
                req.username = decoded.username
                res.send("Authenticated!")
            }
        });
    }
}

exports.signInGoogle = function(req, res){
    client.verifyIdToken({
        idToken: req.body.token,
        audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    }).then(function(ticket){
        const payload = ticket.getPayload();
        const userObj = {
            email: payload.email,
            name: payload.name,
            id: payload.sub
        }
        return processUser(userObj)
    }).then(function(token){
        res.cookie('token', token, { httpOnly: true })
        res.json({api_KEY: process.env.GOOGLE_MAPS_FRONTEND_KEY})
    }).catch(function(err){
        console.log(err)
        res.status(500).send("Issue with Sign in")
    })
}

async function processUser(userId){
    let userAuth = new User(userId);

    await User.findOne({ email: userAuth.email}, function(err, user){
        if(err) {throw err}
        else if(!user){
            //save the new user
            userAuth.save((err) => {
                if(err){
                    throw err
                }
            })
        }
    })

    const payload = {email: userAuth.email}
    //create token
    const token = jwt.sign(payload, secret, {
        expiresIn: '1h'
    });
    return token
}
