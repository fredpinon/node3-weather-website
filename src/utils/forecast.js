const request = require("postman-request");

const weatherstackKey = "659f7221b6a532f409d982940e7cee84&query";
const weatherstackURL = `http://api.weatherstack.com/current`;

const forecast = ({ longitude, latitude, location }, callback) => {
  const url = `${weatherstackURL}?access_key=${weatherstackKey}&query=${longitude},${latitude}`;
  request({ url, json: true }, (error, response) => {
    if (error) {
      callback("Unable to connect to weather service!", undefined);
    } else if (response.body.error) {
      callback(`Unable to find location: ${location}`, undefined);
    } else {
      const {
        weather_descriptions,
        temperature,
        precip,
      } = response.body.current;
      callback(
        undefined,
        `${weather_descriptions[0]}. It is currently ${temperature} out. There is ${precip}% chance of rain`
      );
    }
  });
};

module.exports = forecast;
