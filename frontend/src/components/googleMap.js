import React, {Component, createRef} from 'react';
import '../App.css';
import GooglePlaces from './GooglePlaces';
import PolylineGenerator from './PolylineGenerator';
import Axios from '../../../server/node_modules/axios';


class GoogleMap extends PolylineGenerator {

      constructor(props) {
        super(props);
        this.state = {
          loaded: false, 
          startLocation:{
            lat: 0,
            lng: 0
          },
          endLocation: {
            lat: 0,
            lng: 0
          }
        }
        this.callbackStart = this.callbackStart.bind(this);
        this.callbackEnd = this.callbackEnd.bind(this);
      }

      GoogleMapsRef = createRef()

      componentDidMount() {
        const googleMapsAPI = document.createElement("script")
        googleMapsAPI.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS}&libraries=places,geometry`;
        googleMapsAPI.id = "googleMaps"
        window.document.body.appendChild(googleMapsAPI);

        googleMapsAPI.addEventListener("load", () => {
          this.setState({loaded: true})
          this.googleMaps = this.createMap()
          this.markerStart = null;
          this.markerEnd = null;
        })
      }

      componentDidUpdate(prevProps, prevState){

        if(this.state.endLocation.lat !== 0 && this.state.endLocation.lng !== 0 && 
          this.state.startLocation.lat !== 0 && this.state.startLocation.lng !== 0){

            if (prevState.startLocation !== this.state.startLocation || prevState.endLocation !== this.state.endLocation){
                this.showDirections(this.state.startLocation,this.state.endLocation)

            }
          }

      }


      createMap = () =>
        new window.google.maps.Map(this.GoogleMapsRef.current, {
          zoom: 10,
          center: {
            lat: 37.3230,
            lng: -122.0322
          },
          disableDefaultUI: true,
        })

      
      showDirections(start, end){
          this.generatePolyline(start, end, this.googleMaps).then(directionsData => {
            var polyline = directionsData[0]

            polyline.setMap(this.googleMaps)
            this.googleMaps.fitBounds(directionsData[1])
          });
      }

      callbackStart(coordinates){
          this.setState({startLocation: coordinates});

          var newCoordinates = new window.google.maps.LatLng(coordinates.lat, coordinates.lng);

          this.markerStart = new window.google.maps.Marker({
            position: newCoordinates,
            map: this.googleMaps,
            title: "Start Location",
            animation: window.google.maps.Animation.DROP
          })
          this.googleMaps.setCenter(newCoordinates)
          this.markerStart.setMap(this.googleMaps)

      }

      callbackEnd(coordinates){
        this.setState({endLocation: coordinates});

        var newCoordinates = new window.google.maps.LatLng(coordinates.lat, coordinates.lng);

        this.markerEnd = new window.google.maps.Marker({
          position: newCoordinates,
          title: "End Location",
          animation: window.google.maps.Animation.DROP
        })

        this.googleMaps.setCenter(newCoordinates)
        this.markerEnd.setMap(this.googleMaps)

      }


      render() {
        return (
          <div>
          <div className="map" ref={this.GoogleMapsRef} />
          { this.state.loaded ? <GooglePlaces callbackStart={this.callbackStart} callbackEnd={this.callbackEnd} /> : null }
          </div>
        );
      }
    
}

export default GoogleMap;