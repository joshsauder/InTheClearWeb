import React, {Component} from 'react';
import axios from 'axios';

const snowSeg = '#1E88E5'
const rainSeg = '#43A047'
const sunSeg = '#FBC02D'
const cloudSeg = '#616161'
const stormSeg = '#E53935'

class PolylineGenerator extends Component {

    constructor(props){
        super(props)

        this.polylineArray = []
    }

    createPolylineAndWeatherData(stops, map){
        var bounds = new window.google.maps.LatLngBounds();
        var cityWeather = []
        return this.generatePolyline(stops[0], stops[1], map, bounds).then(directionsData => {
            bounds = directionsData[0]
            cityWeather = cityWeather.concat(directionsData[1])
            console.log(cityWeather)

            stops.shift()
            console.log(stops)
            if(stops.length > 1){
                return this.createPolylineAndWeatherData(stops, map)
            }
            return [bounds, cityWeather]
        })
    }


    generatePolyline(start, end, map, bounds){
        var path;
        var steps
        return axios.get(`/api/directions/${start.lat},${start.lng}/${end.lat},${end.lng}`)
        .then(response => {
            path = window.google.maps.geometry.encoding.decodePath(response.data.points);
            steps = response.data.steps
            delete response.data.points
            return axios.post("/api/directions/info", response.data)
        })
        .then(response => {
            var weather = response.data.weather
            var cities = response.data.locations
            this.weatherPerStep(steps, path, weather, map)

            for (var i = 0; i < path.length; i++) {
                bounds.extend(path[i]);
            }

            var cityWeather = [];
            var cityTemp = []
            cities.forEach((city, index) => {
                let obj = {city: city, weather: weather[index]}
                if(!cityTemp.includes(city)){
                    cityTemp.push(city)
                    cityWeather.push(obj)
                }
            })
            return [bounds, cityWeather]
        }).catch(error => {
            console.log(error)
        })
    }

    getWeatherInfo(steps){
        return axios.post("/api/directions/info", steps)
    }


    weatherPerStep(steps, path, weather, map){
        let i = 0;
        var strokeColor =''

        steps.forEach((step, index) => {
            let ret = this.determineSegCount(step, path, i)
            i = ret[0]
            switch(weather[index].Condition){
                case "rain": 
                    strokeColor = rainSeg;
                    break;
                case "danger":
                    strokeColor = stormSeg;
                    break;
                case "snow":
                case "sleet":
                    strokeColor = snowSeg;
                    break;
                case "cloudy":
                case "partly-cloudy-day":
                case "partly-cloudy-night":
                    strokeColor = cloudSeg;
                    break;
                default: 
                    strokeColor = sunSeg;
                    break;
            }
            
            this.newPolyline(ret[1], strokeColor, map)
        })

        this.newPolyline(path.slice(i, path.length), strokeColor, map)

    }

    determineSegCount(step, path, index){

        let tempPath = []
        var i = index

        while(Math.abs(path[i].lat() - step.end_location.lat) >= 0.1 || Math.abs(path[i].lng() - step.end_location.lng ) >= 0.1 ){
            tempPath.push(path[i])
            i += 1
        }
        if (i != 0){
            i -= 1
        }
        return ([i, tempPath])
    }

    newPolyline(path, color, map){
        var polyline = new window.google.maps.Polyline({
            path: path,
            strokeColor: color,
            strokeOpacity: 1,
            strokeWeight: 6,
        });

        this.polylineArray.push(polyline)
        polyline.setMap(map)
    }

}

export default PolylineGenerator;