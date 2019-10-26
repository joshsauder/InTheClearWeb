const mongoose = require('mongoose');
const schema = mongoose.Schema;

var locationSchema = new schema({
    name: String,
    county: String,
    state: String,
    country: String
})

module.exports = mongoose.model("Location", locationSchema)