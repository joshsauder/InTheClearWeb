import React, {Component} from 'react';
import axios from 'axios';

const snowSeg = '#40C4FF'
const rainSeg = '#4CAF50'
const sunSeg = '#FFEE58'
const cloudSeg = '#BDBDBD'
const stormSeg = '8BC34A'

class PolylineGenerator extends Component {


    generatePolyline(start, end, map){
        return axios.get(`http://localhost:3400/api/directions/${start.lat},${start.lng}/${end.lat},${end.lng}`)
        .then(response => {

            console.log(response.data)
            var path = window.google.maps.geometry.encoding.decodePath(response.data.points);
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
              console.log(polyline)
              return [polyline, bounds]
        }).catch(error => {
            console.log(error)
        })
    }

    // getWeather(params){
    //     let url = ""
    //     return axios.post(url, params);
    // }

    // getLocationNames(){
    //     let url = ""
    //     return axios.post(url, params)
    // }


}

export default PolylineGenerator;