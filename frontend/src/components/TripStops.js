import React, {Component} from 'react';
import {Modal, Button} from "react-bootstrap"
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
            this.stopInput = document.getElementById('stopLocation');

            this.autocompleteStop = new window.google.maps.places.Autocomplete(this.stopInput);

            window.google.maps.event.addListener(this.autocompleteStop, 'place_changed', this.handlePlacesStopSelect)
        }
    }

    handlePlacesStopSelect(){

        var placeStop = this.autocompleteStop.getPlace();

        this.setState(prevState => ({
            stops: [...prevState.stops, placeStop]
        }))

        this.stopInput.value = ""
    }


    render(){
        return(
            <Modal show = {this.props.show} onHide={this.props.hide}>
                <Modal.Header closeButton>
                    <Modal.Title>Trip Stops</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{this.props.start}</p>
                    {this.state.stops.map((stop) =>
                        <p key={stop.name}>{stop.name}</p>
                    )}
                    <p>{this.props.end}</p>
                    <input className="form-control" id="stopLocation" type="text" size="50" placeholder="tripStop" autoComplete="on" runat="server" />
                </Modal.Body>
                <Modal.Footer>
                    <Button className="darkPurple">Set Stops</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default TripStops