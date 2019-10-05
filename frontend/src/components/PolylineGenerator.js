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
            this.weatherPerStep(steps, path, map)
            delete response.data.points
            return axios.post("http://localhost:3400/api/directions/info", response.data)
        })
        .then(response => {
            console.log(response)
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


    weatherPerStep(steps, path, map){
        let i = 0;
        let numSegs = []
        steps.forEach(step => {
            let ret = this.determineSegCount(step, path, i)
            i = ret[0]
            var polyline = new window.google.maps.Polyline({
                path: ret[1],
                strokeColor: '#FF0000',
                strokeOpacity: 1,
                strokeWeight: 2,
            });
            polyline.setMap(map)
        })
    }

    determineSegCount(step, path, index){

        let tempPath = []
        var i = index

        console.log(path[i].lat(), step.end_location.lat)
        console.log(path[i])
        while(Math.abs(path[i].lat() - step.end_location.lat) > 0.001 || Math.abs(path[i].lng() - step.end_location.lng ) > 0.001 ){

            tempPath.push(path[i])
            i += 1
        }

        return ([i, tempPath])
    }

}

export default PolylineGenerator;