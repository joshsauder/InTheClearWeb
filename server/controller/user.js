const User = require('../model/user');
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET
const fs = require('fs')

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const AppleAuth = require('apple-auth');

let auth = new AppleAuth(fs.readFileSync('./config/appleConfig.json'), fs.readFileSync('./config/AuthKey.p8').toString(), 'text');

exports.createUser = function(req, res){

    let newUser = new User(req.body);
    newUser.id = mongoose.Types.ObjectId()
    //save the new user
    newUser.save((err) => {
        if(err){
            res.status(400).send("Error creating user")
        }
        else {res.send("success")}
    })

}

exports.signInUser = function(req, res){

    //find user
    User.findOne({ email: req.body.email}, function(err, user){
        if(err) res.status(500).send("Server error")
        else if(!user){res.status(401).send("User not found")}
        else{
            //compare password
            user.comparePassword(req.body.password, function(err, isMatch){
                if(!isMatch){ res.status(401).send("Incorrect Password") }
                else{

                    const payload = {id: user.id, name: user.name ? user.name : ""}
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

exports.checkAuth = function(req, res){

    const token =
    req.body.token ||
    req.query.token ||
    req.headers['x-access-token'] ||
    req.cookies.token;

    //verify token is there and valid
    if(!token){
        res.status(401).send("No token... Unauthorized.")
    } else{
        jwt.verify(token, secret, function(err, decoded){
            if(err){
                res.status(401).send("Invalid Token... Unauthorized.")
            }else {
                req.email = decoded.email
                res.json({id: decoded.id, name: decoded.name})
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
            name: {
                firstName: payload.given_name,
                lastName: payload.family_name
            },
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

exports.signInApple = async function(req, res){
    try {
        const response = await auth.accessToken(req.body.code);
        const idToken = jwt.decode(response.id_token);

        const user = {};
        user.id = idToken.sub;

        if (idToken.email) user.email = idToken.email;
        if (req.body.user) {
            const { name } = JSON.parse(req.body.user);
            user.name = name;
        }

        let token = await processUser(user)
        res.cookie('token', token, { httpOnly: true })
        res.redirect('http://localhost:3000')
        res.json({api_KEY: process.env.GOOGLE_MAPS_FRONTEND_KEY})
    } catch (ex) {
        console.error(ex);
        res.send("An error occurred!");
    }
}

exports.logout = function(req, res){
    res.clearCookie('token').end()
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

    const payload = {id: userAuth.id, name: userAuth.name ? userAuth.name : ""}
    //create token
    const token = jwt.sign(payload, secret, {
        expiresIn: '1h'
    });
    return token
}
