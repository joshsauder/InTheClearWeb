import React, {Component} from 'react';
import axios from 'axios';

const snowSeg = '#40C4FF'
const rainSeg = '#4CAF50'
const sunSeg = '#FFEE58'
const cloudSeg = '#BDBDBD'
const stormSeg = '8BC34A'

class PolylineGenerator extends Component {


    generatePolyline(locations){

    }

    getWeather(params){
        let url = ""
        return axios.post(url, params);
    }

    getLocationNames(){
        let url = ""
        return axios.post(url, params)
    }


}

export default PolylineGenerator;