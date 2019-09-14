import React from 'react';
import dotenv from 'dotenv'

export const getDirections = (start, end) => {
    dotenv.config();

    var url = "https://maps.googleapis.com/maps/api/directions/json?"
    url = `${url}origin=${start.lat},${start.lng}&destination=${end.lat}${start.lng}&key=${process.env.REACT_APP_GOOGLE_MAPS}`

    fetch(url)
        .then(response => {
            if(response.ok){
                return response.json["routes"]
            }else {
                console.log(response);
            }
        })
        .then(data => console.log(data))
        .catch(data => console.log(data));
}