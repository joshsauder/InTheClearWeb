import React, {Component, createRef} from 'react';
import '../App.css';
import '../style/GooglePlaces.css'
import Jumbotron from 'react-bootstrap/Jumbotron'


class GooglePlaces extends Component {

    constructor(props) {
        super(props);
        this.state ={
            startCoordinates: {
                lat: 37.3317,
                lng: -122.0306
            },
            endCoordinates :{
                lat: 37.3317,
                lng: -122.0306
            }

        }
        
        this.handlePlacesStartSelect = this.handlePlacesStartSelect.bind(this)
        this.handlePlacesEndSelect = this.handlePlacesEndSelect.bind(this)
        
      }

      componentDidMount(){
          
          var startInput = document.getElementById('locationStart');
          var destinationInput = document.getElementById('locationEnd')

          this.autocompleteStart = new window.google.maps.places.Autocomplete(startInput);
          this.autocompleteDest = new window.google.maps.places.Autocomplete(destinationInput);

          window.google.maps.event.addListener(this.autocompleteStart, 'place_changed', this.handlePlacesStartSelect)

          window.google.maps.event.addListener(this.autocompleteDest, 'place_changed', this.handlePlacesEndSelect)

      }

      handlePlacesStartSelect(){
        var placeStart = this.autocompleteStart.getPlace();
        document.getElementById('cityStart').value = placeStart.name;
        var lat = document.getElementById('latStart').value = placeStart.geometry.location.lat();
        var long = document.getElementById('longStart').value = placeStart.geometry.location.lng();
        this.setState({startCoordinates:{lat: lat, lng: long}})
      }

      handlePlacesEndSelect(){

            var placeEnd = this.autocompleteDest.getPlace();
            document.getElementById('cityEnd').value = placeEnd.name;
            var lat = document.getElementById('latEnd').value = placeEnd.geometry.location.lat();
            var long = document.getElementById('longEnd').value = placeEnd.geometry.location.lng();
            this.setState({endCoordinates:{lat: lat, lng: long}})

      }

      componentDidUpdate(prevProps, prevState){
            if(prevState.startCoordinates !== this.state.startCoordinates){
                this.props.callbackStart(this.state.startCoordinates);
            } else if(prevState.endCoordinates !== this.state.endCoordinates){
                this.props.callbackEnd(this.state.endCoordinates);
            }
      }

      render() {
          return (
          <div className="row container">
            <Jumbotron className="directionsJumbotron ml-md-2 mt-md-2 col-md-6 col-12">
                <div className="input-group mb-1">
                    <input className="form-control" id="locationStart" type="text" size="50" placeholder="Start Location" autoComplete="on" runat="server" />
                    <input type="hidden" id="cityStart" name="city2" />
                    <input type="hidden" id="latStart" name="cityLat" />
                    <input type="hidden" id="longStart" name="cityLng" />
                </div>
                <div className="input-group mb-1 mt-4">
                    <input className="form-control" id="locationEnd" type="text" size="50" placeholder="Destination Location" autoComplete="on" runat="server" />
                    <input type="hidden" id="cityEnd" name="city2" />
                    <input type="hidden" id="latEnd" name="cityLat" />
                    <input type="hidden" id="longEnd" name="cityLng" />
                </div>
            </Jumbotron>
          </div>
          )
      }
}

export default GooglePlaces;