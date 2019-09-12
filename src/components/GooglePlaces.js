import React, {Component, createRef} from 'react';
import '../App.css';
import '../style/GooglePlaces.css'
import Jumbotron from 'react-bootstrap/Jumbotron'


class GooglePlaces extends Component {

    constructor(props) {
        super(props);
      }

      componentDidMount(){
          
          var startInput = document.getElementById('locationStart');
          var destinationInput = document.getElementById('locationEnd')

          var autocompleteStart = new window.google.maps.places.Autocomplete(startInput);
          var autocompleteDest = new window.google.maps.places.Autocomplete(destinationInput);

          window.google.maps.event.addListener(autocompleteStart, 'place_changed', function() {
            var placeStart = autocompleteStart.getPlace();
            document.getElementById('cityStart').value = placeStart.name;
            document.getElementById('latStart').value = placeStart.geometry.location.lat();
            document.getElementById('longStart').value = placeStart.geometry.location.lng();

          })

          window.google.maps.event.addListener(autocompleteDest, 'place_changed', function() {
            var placeEnd = autocompleteStart.getPlace();
            document.getElementById('cityEnd').value = placeEnd.name;
            document.getElementById('latEnd').value = placeEnd.geometry.location.lat();
            document.getElementById('longEnd').value = placeEnd.geometry.location.lng();
  
          })
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