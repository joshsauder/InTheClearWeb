import React from 'react';
import dotenv from 'dotenv'

export const getDirections = (start, end) => {
    dotenv.config();

    var url = "https://maps.googleapis.com/maps/api/directions/json?"
    url = `${url}origin=${start}&destination=${end}&key=${process.env.REACT_APP_GOOGLE_MAPS}`
}