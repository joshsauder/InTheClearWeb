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

function getCityNamesAndWeather(steps){
    let stepObj = {List: []}
    for (var step in steps) {
        var data = {}
        data["lat"] = step.endLocation.lat
        data["long"] = step.endLocation.lng
        stepObj.List.push(data);
    }
    axios.all([getWeather(stepObj), getLocationNames(stepObj)])
    .then(axios.spread(function (weather, location){
        return [weather, location];
    }))
}

function getWeather(params){
    let url = `https://${process.env.AWS_KEY}.execute-api.us-east-1.amazonaws.com/Prod/weather`
    return axios.post(url, params);
}

function getLocationNames(){
    let url = `https://${process.env.AWS_KEY}.execute-api.us-east-1.amazonaws.com/Prod/reveresegeocode`
    return axios.post(url, params)
}