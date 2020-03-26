const mongoose = require('mongoose')
const User = require('../model/user')
const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET

exports.createUser = async function(user){

    const user = await User.create(user)

    if(!user){
        throw new Error('User could not be Created')
    }
    
    return user

}

exports.signInUser = async function(userAuth, fun){

    const user = await User.findOne({username: userAuth.username})

    if(!user) throw new Error('User not found!')

    user.comparePassword(userAuth.password), function(err, isMatch){
        if(!isMatch){throw new Error('Incorrect Password')}
        else {
            const payload = {username: userAuth.username}
            //create token
            const token = jwt.sign(payload, secret, {
                expiresIn: '1h'
            });

            fun(token)
        }
    }
}

exports.updateUser = async function(userName, user){
    
    const updatedUser = await User.updateOne({username: userName}, user)

    if(!updatedUser) throw new Error('Could not update User')
    else {
        return updatedUser
    }
}

exports.checkAuth = function(token){

    if(!token) throw new Error('No Token... Unauthorized')

    else {
        const decoded = jwt.verify(token, secret)

        if(!decoded) throw new Error("Invalid Token... Unauthorized.")
        else {
            return "Authenticated"
        }
    }
}