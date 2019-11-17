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

        this.cityWeather =[]
        this.duration = 0
        this.distance = 0
        
    }

    async createPolylineAndWeatherData(stops, map, bounds, dates){

        await this.generatePolyline(stops[0], stops[1], map, bounds, dates.shift())   

        stops.shift()
        if(stops.length > 1){
            await this.createPolylineAndWeatherData(stops, map, bounds, dates)   
        }

        return [bounds, this.cityWeather, this.duration, this.distance]
    }


    async generatePolyline(start, end, map, bounds, date){
        var path;
        var steps
        try {
            const response = await axios.get(`/api/directions/${start.lat},${start.lng}/${end.lat},${end.lng}`);
            path = window.google.maps.geometry.encoding.decodePath(response.data.points);
            steps = response.data.steps;

            const response_1 = await axios.post("/api/directions/info", {steps: steps, date: date});
            var weather = response_1.data.weather;
            var cities = response_1.data.locations;

            this.weatherPerStep(steps, path, weather, map);
            for (var i = 0; i < path.length; i++) {
                bounds.extend(path[i]);
            }

            var cityTemp = [];
            cities.forEach((city, index) => {
                let obj = { city: city, weather: weather[index] };
                if (!cityTemp.includes(city)) {
                    cityTemp.push(city);
                    this.cityWeather.push(obj);
                }
            });
        }
        catch (error) {
            console.log(error);
        }
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
            this.duration += step.duration.value
            this.distance += step.distance.value
            
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