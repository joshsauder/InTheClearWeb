import React, {Component} from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Card from 'react-bootstrap/Card'
import '../style/CityData.css'

function RenderCityData(props){

    return( 
        <div className="menuScroll">
            {props.city.map((city, index) => 
                <Card body key={index}>
                    <div className="col-6">{city}</div>
                    <div className="col-6">{props.weather[index].Condition}</div>
                </Card>
            )}
        </div>
    )

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