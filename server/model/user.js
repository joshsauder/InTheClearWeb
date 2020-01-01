const { Schema, model } = require('mongoose');
const { genSalt, hash, compare } = require('bcrypt');

const SALT_FACTOR = 10

var userSchema = new Schema({
    name: JSON,
    email: {type: String, unique: true, required: true},
    id: {type: String, required: true, unique: true},
    createdAt: Date,
    updatedAt: Date
})

userSchema.pre('save', function(next){

    var user = this

    //handle date
    var date = new Date()

    this.updatedAt = date;
    if(!user.createdAt){ user.createdAt = date }

    //Not used as passwords are not stored (see comparePassword comments)
    if(!user.password || !user.isModified('password')) {return next()}

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


/*
Not currently used as passwords are not being stored with Apple and Google Login
Kept for future use
*/
userSchema.methods.comparePassword = function(candidatePassword, cb) {
    //compare submitted password with the actual password
    compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = model('users', userSchema)