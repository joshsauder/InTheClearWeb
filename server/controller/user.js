const mongoose = require('mongoose')
const user = require('../model/user')

const userSchema = mongoose.model('User', user)

exports.createUser = function(req, res){

    let newUser = new userSchema(req.body);

    newUser.save((err, user) => {
        if(err){
            res.send(err)
        }
        res.send("success")
    })

}