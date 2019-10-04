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
            this.weatherPerStep(steps, path)
            delete response.data.points
            return axios.post("http://localhost:3400/api/directions/info", response.data)
        })
        .then(response => {
            console.log(response)
            var bounds = new window.google.maps.LatLngBounds();

            for (var i = 0; i < path.length; i++) {
                bounds.extend(path[i]);

              }
            
              var polyline = new window.google.maps.Polyline({
                path: path,
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                map: map
              });
              return [polyline, bounds]
        }).catch(error => {
            console.log(error)
        })
    }

    getWeatherInfo(steps){
        return axios.post("http://localhost:3400/api/directions/info", steps)
    }


    weatherPerStep(steps, path){
        let i = 0;
        let numSegs = []
        steps.forEach(step => {
            let ret = determineSegCount(step, path, i)
            i = ret[0]
            numSegs.push(ret[1])
        })
    }

    determineSegCount(step, path, index){

        let i = index
        let numberSegs = 1

        while(abs(path[i].lat - step.end_location.lat) > 0.3 || abs(path[i].lng - step.end_location.lng )> 0.3 ){

            numberSegs += 1
            i += 1
        }

        return ([i, numberSegs])
    }

}

export default PolylineGenerator;