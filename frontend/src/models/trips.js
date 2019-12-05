import React from 'react'


export class TripsModel {

    constructor(){
        this.tripData = []
        this.duration = 0
        this.distance = 0
        this.startLocation = {
            lat: 0,
            lng: 0,
            name: ""
        }
        this.endLocation = {
            lat: 0,
            lng: 0,
            name: ""
        }
        this.stops = []
    }
}