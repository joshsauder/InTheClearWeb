const User = require('../model/user');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET
const fs = require('fs')

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const AppleAuth = require('apple-auth');

let auth = new AppleAuth(fs.readFileSync('./config/appleConfig.json'), fs.readFileSync('./config/AuthKey.p8').toString(), 'text');

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
