const axios = require('axios');
const HttpError = require('../models/http.error');
const API_KEY = 'AIzaSyAXsaQCDGDI_fcrqtU8__-mYwLF05f9v3s';

const getCoordforAddress = async (address) => {
    
    // encodeURIComponent -> removes white space and special characters
    // const result = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`);
    // const data = result.data;

    // if (!data || data.status === 'ZERO_RESULTS') {
    //     const error = new HttpError('Could not find location for the specified address', 422);
    //     throw error;
    // }

    // console.log(data)
    // const coordinates = data.results[0].geometry.location;
    // return coordinates;

    return {
        lat: 40.7484474,
        lng: -73.9871516
    };
};


module.exports = {
    getCoordforAddress
};