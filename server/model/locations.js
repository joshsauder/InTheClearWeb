const mongoose = require('mongoose');
const schema = mongoose.Schema;

var locationSchema = new schema({
    city: String,
    condition: String,
    severe: Number,
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