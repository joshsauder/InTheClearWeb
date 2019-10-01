require('dotenv').config()
import axios from 'axios';

exports.getDirections = function(req, res) {
    const start = req.params.start
    const end = req.params.end

    let key = process.env.GOOGLE_MAPS_KEY
    let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${start}&destination=${end}&mode=driving&key=${key}`

    axios.get(url)
    .then(function(response){
        res.send(response.data.routes[0].overview_polyline);
    }).catch(error => {console.log(error)})

    
}

exports.getCityNamesAndWeather = function(req, res){
    let stepObj = {List: []}
    const steps = req.body.steps
    let time = Math.round(new Date().getTime()/1000)

    //add start location
    var data = {}
    data["lat"] = steps[0].start_location.lat
    data["long"] = steps[0].start_location.lng
    data["time"] = time 

    //add each step
    steps.forEach(step => {
        var data = {}
        data["lat"] = step.end_location.lat
        data["long"] = step.end_location.lng
        data["time"] = time + step.duration.value
        stepObj.List.push(data);
        
    });

    axios.all([getWeather(stepObj), getLocationNames(stepObj)])
    .then(axios.spread(function (weather, location){
        res.send({weather: weather.data, locations: location.data})
    }))
}

function getWeather(params){
    let url = `https://${process.env.AWS_KEY}.execute-api.us-east-1.amazonaws.com/Prod/weather`
    return axios.post(url, params);
}

function getLocationNames(params){
    let url = `https://${process.env.AWS_KEY}.execute-api.us-east-1.amazonaws.com/Prod/reveresegeocode`
    return axios.post(url, params)
}