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
            {props.city.map((city, index) => 
                <Card key={index}>
                    <Card.Body className="row"> 
                        <div className="col-6">
                            <div className="row">
                                <div className="col-12 text-left">{city}</div>
                            </div>
                            <div className="row">
                                <div className="col-8 text-left">{props.weather[index].Description}</div>   
                                <div className="col-4 text-left">{Math.round(props.weather[index].Temperature)}&deg;</div>
                            </div>
                        </div>
                        <div className="col-6"><img className="mx-auto d-block img-fluid" src={determineIcon(props.weather[index].Condition)} /></div>
                    </Card.Body>
                </Card>
            )}
        </div>
    )

}

function determineIcon(condition){
    switch(condition){
        case "rain": 
            return rain;
        case "danger":
            return danger;
        case "snow":
        case "sleet":
            return snow;
        case "cloudy":
            return cloudy;
        case "partly-cloudy-day":
            return partlyCloudy;
        case "partly-cloudy-night":
            return cloudNight;
        case "clear-night":
            return night;
        default: 
            return sun;
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
                    <RenderCityData city={this.props.city} weather={this.props.weather}/>
                </Jumbotron>
            </div>
        )
    }
}

export default CityData;