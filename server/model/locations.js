const mongoose = require('mongoose');
const schema = mongoose.Schema;

var locationSchema = new schema({
    cit: String,
    county: String,
    state: String,
    country: String,
    createdAt: Date
})

locationSchema.pre('insertMany', function(next, locations){
    
    var date = Date()

    locations.forEach(element => {
        element.createdAt = date
    });

    next()
})

module.exports = mongoose.model("Location", locationSchema)