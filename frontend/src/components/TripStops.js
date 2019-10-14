import React, {Component} from 'react';
import {Modal} from "react-bootstrap"
import '../style/TripStops.css'

class TripStops extends Component {

    constructor(props){
        super(props)

        this.state = {
            stops: []
        }
        this.handlePlacesStopSelect = this.handlePlacesStopSelect.bind(this)
    }

    componentDidUpdate(prevProps, prevState){

        if(this.props.show == true){
            var stopInput = document.getElementById('stopLocation');
            console.log(stopInput)

            this.autocompleteStop = new window.google.maps.places.Autocomplete(stopInput);

            window.google.maps.event.addListener(this.autocompleteStop, 'place_changed', this.handlePlacesStopSelect)
        }
    }

    handlePlacesStopSelect(){

        var placeStop = this.autocompleteStop.getPlace();
        var stops = this.state.stops
        this.setState({stops: stops.push(placeStop)})

    }


    render(){
        return(
            <Modal show = {this.props.show} onHide={this.props.hide}>
                <Modal.Header closeButton>
                    <Modal.Title>Trip Stops</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.stops.map(stop =>
                        <p>{stop}</p>
                    )}
                    <input className="form-control" id="stopLocation" type="text" size="50" placeholder="tripStop" autoComplete="on" runat="server" />
                </Modal.Body>
            </Modal>
        )
    }
}

export default TripStops