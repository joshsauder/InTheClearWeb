import React, {Component, createRef} from 'react';
import '../App.css';
import GooglePlaces from './GooglePlaces';
import PolylineGenerator from './PolylineGenerator';
import CityData from './CityData'
import TripStops from './TripStops'

class GoogleMap extends PolylineGenerator {

      constructor(props) {
        super(props);
        this.state = {
          loaded: false, 
          startLocation:{
            lat: 0,
            lng: 0,
            name: ""
          },
          endLocation: {
            lat: 0,
            lng: 0,
            name: ""
          },
          startMarker: null,
          endMarker: null,
          cityData: [],
          showStopModal: false
        }
        this.callbackStart = this.callbackStart.bind(this);
        this.callbackEnd = this.callbackEnd.bind(this);
        this.showDirections = this.showDirections.bind(this);
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
        })
      }

      componentDidUpdate(prevProps, prevState){

        if(this.state.endLocation.lat !== 0 && this.state.endLocation.lng !== 0 && 
          this.state.startLocation.lat !== 0 && this.state.startLocation.lng !== 0){

            if (prevState.startLocation !== this.state.startLocation || prevState.endLocation !== this.state.endLocation){
                this.showModal()

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

      showModal(){
        this.setState({showStopModal: true})
      }

      showDirections(stops){
          this.polylineArray.forEach(line => {
            line.setMap(null)
          })
          this.polylineArray = []
          this.createPolylineAndWeatherData([this.state.startLocation, stops, this.state.endLocation], this.googleMaps).then(directionsData => {
            this.googleMaps.fitBounds(directionsData[0])
            this.setState({
              cityData: directionsData[1]
            })
          });

      }



      callbackStart(coordinates){
          this.setState({startLocation: coordinates});
          if(this.state.markerStart){ this.state.markerStart.setMap(null); }

          var newCoordinates = new window.google.maps.LatLng(coordinates.lat, coordinates.lng);

          this.state.markerStart = new window.google.maps.Marker({
            position: newCoordinates,
            map: this.googleMaps,
            title: "Start Location",
            animation: window.google.maps.Animation.DROP
          })
          this.googleMaps.setCenter(newCoordinates)
          this.state.markerStart.setMap(this.googleMaps)

      }

      callbackEnd(coordinates){
        this.setState({endLocation: coordinates});
        if(this.state.markerEnd){ this.state.markerEnd.setMap(null); }

        var newCoordinates = new window.google.maps.LatLng(coordinates.lat, coordinates.lng);

        this.state.markerEnd = new window.google.maps.Marker({
          position: newCoordinates,
          title: "End Location",
          animation: window.google.maps.Animation.DROP
        })

        this.googleMaps.setCenter(newCoordinates)
        this.state.markerEnd.setMap(this.googleMaps)

      }


      render() {
        let modalClose = () => this.setState({ showStopModal: false });
        return (
          <div>
            <div className="map" ref={this.GoogleMapsRef} />
              { this.state.loaded ? <GooglePlaces callbackStart={this.callbackStart} callbackEnd={this.callbackEnd} /> : null }
              {this.state.cityData.length > 0 ? <CityData cityData={this.state.cityData}/> : null}
              { this.state.loaded ? <TripStops show={this.state.showStopModal} hide={modalClose} start={this.state.startLocation.name} end={this.state.endLocation.name} callback={this.showDirections} /> : null }
          </div>
        );
      }
    
}

export default GoogleMap;