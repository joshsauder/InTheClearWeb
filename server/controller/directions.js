require('dotenv').config();
const axios = require('axios')

exports.getDirections = function(req, res) {
    const start = req.params.start
    const end = req.params.end

    let key = process.env.GOOGLE_MAPS_KEY
    let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${start}&destination=${end}&mode=driving&key=${key}`

    axios.get(url)
    .then(function(response){
        res.send({points: response.data.routes[0].overview_polyline.points, steps:response.data.routes[0].legs[0].steps});
    }).catch(error => {
        console.log(error)
        res.status(500).send("Error getting directions.")
    })

    
}

exports.getCityNamesAndWeather = function(req, res){
    let stepObj = {List: []}
    const steps = req.body.steps

    var time = Math.round(new Date(req.body.date).getTime()/1000)

    //add initial location
    var data = {}
    data["lat"] = steps[0].start_location.lat
    data["long"] = steps[0].start_location.lng
    data["time"] = time
    stepObj.List.push(data);

    //add each step
    steps.forEach(step => {
        var data = {}
        data["lat"] = step.end_location.lat
        data["long"] = step.end_location.lng
        time += step.duration.value
        data["time"] = time
        stepObj.List.push(data);
        
    });


    axios.all([getWeather(stepObj), getLocationNames(stepObj)])
    .then(axios.spread(function (weather, location){
        res.send({weather: weather.data, locations: location.data})
    })).catch(err =>{
        res.status(500).send("Error getting weather and city data.")
    })
}

function getWeather(params){
    let url = `https://${process.env.AWS_KEY}.execute-api.us-east-1.amazonaws.com/Prod/weather`
    return axios.post(url, params);
}

function getLocationNames(params){
    let url = `https://${process.env.AWS_KEY}.execute-api.us-east-1.amazonaws.com/Prod/reveresegeocode`
    return axios.post(url, params)
}