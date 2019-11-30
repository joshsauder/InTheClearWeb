import React, {Component, createRef} from 'react';
import '../App.css';
import GooglePlaces from './GooglePlaces';
import PolylineGenerator from './PolylineGenerator';
import CityData from './CityData';
import TripStops from './TripStops';
import {TripsModel} from '../models/trips';
import Axios from 'axios';

class GoogleMap extends PolylineGenerator {

      constructor(props) {
        super(props);
        this.state = {
          loaded: false, 
          showCityData: false,
          startMarker: null,
          endMarker: null,
          tripData: new TripsModel(),
          showStopModal: false
        }
        this.showDirections = this.showDirections.bind(this);
        this.polylineArray = []
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

        if(this.state.tripData.endLocation.lat !== 0 && this.state.tripData.endLocation.lng !== 0 && 
          this.state.tripData.startLocation.lat !== 0 && this.state.tripData.startLocation.lng !== 0){
            if (prevState.tripData.startLocation !== this.state.tripData.startLocation || prevState.tripData.endLocation !== this.state.tripData.endLocation){
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

      async showDirections(stops, dates){
          this.setState({showStopModal: false, showCityData: true})
          this.polylineArray.forEach(line => {
            line.setMap(null)
          })
          this.polylineArray = []
          var bounds = new window.google.maps.LatLngBounds();
          var directionsData = await this.createPolylineAndWeatherData(stops, this.googleMaps, bounds, dates)
  
          this.googleMaps.fitBounds(directionsData[0])
          var tripData = Object.assign({}, this.state.tripData)

          tripData.tripData = directionsData[1]
          tripData.duration = directionsData[2]
          tripData.distance = directionsData[3]
          this.postStops(tripData.tripData)
          this.setState({
            tripData: tripData
          })

      }


      postStops = (tripData) => {
        const data = tripData.map(trip => {
          return {
            city: trip.city,
            condition: trip.weather.Description,
            severe: trip.weather.severe
          }
        })
        Axios.post('/api/locations', data).catch(err => {
          console.log(err)
        })
      }

      callbackStart = (coordinates) => {
          var tripData = Object.assign({}, this.state.tripData)
          tripData.startLocation = coordinates
          this.setState({tripData: tripData});

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

      callbackEnd = (coordinates) => {
        var tripData = Object.assign({}, this.state.tripData)
        tripData.endLocation = coordinates
        this.setState({tripData: tripData});

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
              { this.state.showCityData ? <CityData cityData={this.state.tripData}/> : null}
              { this.state.loaded ? <TripStops show={this.state.showStopModal} hide={modalClose} start={this.state.tripData.startLocation} end={this.state.tripData.endLocation} callback={this.showDirections} /> : null }
          </div>
        );
      }
    
}

export default GoogleMap;