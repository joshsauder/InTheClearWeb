import React, {Component, createRef} from 'react';
import '../App.css';
import '../style/GooglePlaces.css'
import Jumbotron from 'react-bootstrap/Jumbotron'


class GooglePlaces extends Component {

    constructor(props) {
        super(props);
      }

      componentDidMount(){
          
          const google = this.props.google;
          const script = document.getElementById("googleMapsAPI")
          var input = document.getElementById('autoCompleteText');

          var autocomplete = new window.google.maps.places.Autocomplete(input);

          window.google.maps.event.addListener(autocomplete, 'place_changed', function() {
          var place = autocomplete.getPlace();
          document.getElementById('altCity').value = place.name;
          document.getElementById('lat').value = place.geometry.location.lat();
          document.getElementById('long').value = place.geometry.location.lng();

        })
      }

      render() {
          return (
          <div>
            <Jumbotron className="jumbotron">
                <input id="autoCompleteText" type="text" size="50" placeholder="Start Location" autoComplete="on" runat="server" />
                <input type="hidden" id="altCity" name="city2" />
                <input type="hidden" id="lat" name="cityLat" />
                <input type="hidden" id="long" name="cityLng" />
            </Jumbotron>
          </div>
          )
      }
}

export default GooglePlaces;