import React, {Component, createRef} from 'react';
import '../App.css';

class GoogleMap extends Component {

      constructor(props) {
        super(props);
      }

      GoogleMapsRef = createRef()

      componentDidMount() {
        const googleMapsAPI = document.createElement("script")
        googleMapsAPI.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDgTUfZ58_ThjicV-8X0JBcNKIibtrr_m0&libraries=places";
        window.document.body.appendChild(googleMapsAPI);

        googleMapsAPI.addEventListener("load", () => {
          this.googleMaps = this.createMap()
          //add createMarker here
        })
      }


      createMap = () =>
        new window.google.maps.Map(this.GoogleMapsRef.current, {
          zoom: 16,
          center: {
            lat: 37.3317,
            lng: -122.0306
          },
          disableDefaultUI: true,
        })

      render() {
        return (
          <div id="map" ref={this.GoogleMapsRef} />
        );
      }
    
}

export default GoogleMap;