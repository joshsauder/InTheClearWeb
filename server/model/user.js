const mongoose = require('mongoose');
const schema = mongoose.Schema;
const userSchema = require('../model/user')

const SALT_FACTOR = 10

var userSchema = new schema({
    name: String,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: String,
    createdAt: Date,
    updatedAt: Date
})

userSchema.pre(save, function(next){

    //handle date
    var date = new Date()

    this.updatedAt = date;
    if(!this.createdAt){ this.createdAt = date }

    //process and hash password
    if(!this.isModified('password')) {return next()}

    bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
        if (err) return next(err);

        //hash password
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            this.password = hash;
            next();
        });
    });
});


userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

var user = mongoose.model('User', userSchema);

module.exports = user;