const { Schema, model } = require('mongoose');
const { genSalt, hash, compare } = require('bcrypt');

const SALT_FACTOR = 10

var userSchema = new Schema({
    name: String,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: String,
    createdAt: Date,
    updatedAt: Date
})

userSchema.pre('save', function(next){

    var user = this

    //handle date
    var date = new Date()

    this.updatedAt = date;
    if(!user.createdAt){ user.createdAt = date }

    //process and hash password
    if(!user.isModified('password')) {return next()}

    genSalt(SALT_FACTOR, function(err, salt) {
        if (err) return next(err);

        //hash password
        hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});


userSchema.methods.comparePassword = function(candidatePassword, cb) {
    //compare submitted password with the actual password
    compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = model('users', userSchema)