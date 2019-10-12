import React, {Component} from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';
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


function RenderCityData(props){

    return( 
        <div className="menuScroll">
            {props.cityData.map((city, index) => 
                <Card key={index} className={`${determineIcon(city.weather.Condition)[1]} mb-3 shadow rounded`} >
                    <Card.Body className="row"> 
                        <div className="col-6 text-white">
                            <div className="row">
                                <div className="col-12 text-left">{city.city}</div>
                            </div>
                            <div className="row">
                                <div className="col-8 text-left">{city.weather.Description}</div>   
                                <div className="col-4 text-left">{Math.round(city.weather.Temperature)}&deg;</div>
                            </div>
                        </div>
                        <div className="col-6"><img className="mx-auto d-block img-fluid img-white" src={determineIcon(city.weather.Condition)[0]} /></div>
                    </Card.Body>
                </Card>
            )}
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
                <Jumbotron className = "ml-md-2 col-md-6 col-12 cityDataJumbotron">
                    <RenderCityData cityData={this.props.cityData}/>
                </Jumbotron>
            </div>
        )
    }
}

export default CityData;