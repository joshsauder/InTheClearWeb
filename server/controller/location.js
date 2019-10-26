const mongoose = require('mongoose')
const location = require('../model/locations')

exports.addLocation = function(req, res){

    const locations = req.body.locations.map(loc => {
        return(new location(loc))

    })

    location.insertMany(locations, function(err){
        if(err) res.status(500).send("Error inserting list" + err)
        else{
            res.send("Success")
        }
    })
}