const request = require("postman-request");

const mapboxToken =
  "pk.eyJ1IjoiZnJlZGVyaWNwaW5vbiIsImEiOiJjazl5ajZwdW0wcTB6M210ZXJqZTRjcTFoIn0.pP8Zm46Wnuxq2IU9fwRBWw";
const geocodeURL = `https://api.mapbox.com/geocoding/v5/mapbox.places`;

const geocode = (address, callback) => {
  const url = `${geocodeURL}/${encodeURIComponent(
    address
  )}.json?access_token=${mapboxToken}`;
  request({ url, json: true }, (error, response) => {
    if (error) {
      callback("Unable to connect to location services!", undefined);
    } else if (response.body.features.length === 0) {
      callback("Unable to find location. Try another search.", undefined);
    } else {
      const { body } = response;
      const feature = body.features[0];
      callback(undefined, {
        longitude: feature.center[1],
        latitude: feature.center[0],
        location: feature.place_name,
      });
    }
  });
};

module.exports = geocode;
