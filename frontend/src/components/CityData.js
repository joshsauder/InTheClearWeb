import React, {Component} from 'react';
import {Jumbotron, Spinner} from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import '../style/CityData.css';
import cloudy from '../images/cloud.png';
import cloudNight from '../images/CloudyNight.png';
import danger from '../images/danger.png';
import night from '../images/Night.png';
import partlyCloudy from '../images/partlyCloudy.png';
import rain from '../images/rain.png';
import snow from '../images/snow.png';
import sun from '../images/sun.png';
import arrow from '../images/arrow-right-solid.svg'


function RenderCityData(props){

    let distance = Math.round(props.cityData.distance/1609.344)

    let min = Math.round(props.cityData.duration / 60)
    let hour = Math.round(props.cityData.duration / 3600)

    let hourString = hour > 0 ? `${hour}hr` : ""
    let minString = min > 0 ? `${min}min` : ""

    return(
        <div>
            <Card className="mb-2 shadow rounded">
                <Card.Body>
                    <div className="lead row col-12"><b>{props.cityData.startLocation.name}</b><img src={arrow} className="d-block arrow-img ml-2 mr-2"></img><b>{props.cityData.endLocation.name}</b></div>
                    <div className="lead">Distance: {distance} miles</div>
                    <div className="lead">Driving Time: {hourString} {minString}</div>
                </Card.Body>
            </Card>
            <div className="menuScroll">
                {props.cityData.tripData.map((city, index) => 
                    <Card key={index} className={`${determineIcon(city.weather.Condition)[1]} mb-3 shadow rounded`} >
                        <Card.Body className="row"> 
                            <div className="col-7 text-white">
                                <div className="row">
                                    <div className="col-12 text-left lead">{city.city}</div>
                                </div>
                                <div className="row">
                                    <div className="col-8 text-left lead">{city.weather.Description}</div>   
                                    <div className="col-4 text-left lead">{Math.round(city.weather.Temperature)}&deg;</div>
                                </div>
                            </div>
                            <div className="col-5"><img className="mx-auto d-block img-fluid img-white" src={determineIcon(city.weather.Condition)[0]} /></div>
                        </Card.Body>
                    </Card>
                )}
            </div>
        </div> 
    )

}

function determineIcon(condition){
    switch(condition){
        case "rain": 
            return [rain, "rainCell"];
        case "danger":
            return [danger, "stormCell"];
        case "snow":
        case "sleet":
            return [snow, "snowCell"];
        case "cloudy":
            return [cloudy, "cloudCell"];
        case "partly-cloudy-day":
            return [partlyCloudy, "cloudCell"];
        case "partly-cloudy-night":
            return [cloudNight, "cloudCell"];
        case "clear-night":
            return [night, "nightCell"];
        default: 
            return [sun, "sunCell"];
    }
}

class CityData extends Component {

    constructor(props){
        super(props);
    }


    render(){
        return(
            <div className="row container">
                <Jumbotron className = "ml-md-2 col-5 cityDataJumbotron">
                    {this.props.cityData.tripData.length > 0 ? 
                    <RenderCityData cityData={this.props.cityData}/> :
                    <div className="d-flex justify-content-center">
                        <Spinner animation="border" variant="light" />
                    </div> }
                </Jumbotron>
            </div>
        )
    }
}

export default CityData;