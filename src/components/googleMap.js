import React, {Component, createRef} from 'react';
import '../App.css';
import GooglePlaces from './GooglePlaces';
import dotenv from 'dotenv';

class GoogleMap extends Component {

      constructor(props) {
        super(props);
        this.state = {loaded: false}
        dotenv.config()
      }

      GoogleMapsRef = createRef()

      componentDidMount() {
        const googleMapsAPI = document.createElement("script")
        googleMapsAPI.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_KEY}0&libraries=places`;
        googleMapsAPI.id = "googleMaps"
        window.document.body.appendChild(googleMapsAPI);

        googleMapsAPI.addEventListener("load", () => {
          this.setState({loaded: true})
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
          <div>
          <div className="map" ref={this.GoogleMapsRef} />
          { this.state.loaded ? <GooglePlaces /> : null }
          </div>
        );
      }
    
}

export default GoogleMap;