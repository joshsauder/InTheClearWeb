const mongoose = require('mongoose');
const schema = mongoose.Schema;

var userSchema = new schema({
    name: String,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: String,
    createdAt: Date,
    updatedAt: Date
})

var user = mongoose.model('User', userSchema);

module.exports = user;