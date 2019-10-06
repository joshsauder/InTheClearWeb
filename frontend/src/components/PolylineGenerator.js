import React, {Component} from 'react';
import axios from 'axios';

const snowSeg = '#40C4FF'
const rainSeg = '#4CAF50'
const sunSeg = '#FFEE58'
const cloudSeg = '#BDBDBD'
const stormSeg = '8BC34A'

class PolylineGenerator extends Component {


    generatePolyline(start, end, map){
        var path;
        var steps
        return axios.get(`http://localhost:3400/api/directions/${start.lat},${start.lng}/${end.lat},${end.lng}`)
        .then(response => {
            path = window.google.maps.geometry.encoding.decodePath(response.data.points);
            steps = response.data.steps
            delete response.data.points
            return axios.post("http://localhost:3400/api/directions/info", response.data)
        })
        .then(response => {
            var weather = response.data.weather
            this.weatherPerStep(steps, path, weather, map)
            

            var bounds = new window.google.maps.LatLngBounds();

            for (var i = 0; i < path.length; i++) {
                bounds.extend(path[i]);

              }
            
              return [bounds]
        }).catch(error => {
            console.log(error)
        })
    }

    getWeatherInfo(steps){
        return axios.post("http://localhost:3400/api/directions/info", steps)
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
            
            var polyline = this.newPolyline(ret[1], strokeColor)
            polyline.setMap(map)
        })

        var polyline = this.newPolyline(path.slice(i, path.length), strokeColor)
        polyline.setMap(map)
    }

    determineSegCount(step, path, index){

        let tempPath = []
        var i = index

        while(Math.abs(path[i].lat() - step.end_location.lat) >= 0.01 || Math.abs(path[i].lng() - step.end_location.lng ) >= 0.01 ){
            tempPath.push(path[i])
            i += 1
        }
        if (i != 0){
            i -= 1
        }
        return ([i, tempPath])
    }

    newPolyline(path, color){
        var polyline = new window.google.maps.Polyline({
            path: path,
            strokeColor: color,
            strokeOpacity: 1,
            strokeWeight: 2,
        });

        return polyline
    }

}

export default PolylineGenerator;