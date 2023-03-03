import axios from 'axios';

const TIMEOUT = import.meta.env.VITE_AXIOS_TIMEOUT;
// const URL = `https:/httpstat.us/404`;
const WEATHER_SERVER = import.meta.env.VITE_JAWA_SERVER;
const URL = `https://${WEATHER_SERVER}/weather`;

/**
 * getWeather
 * @param {array} places: array of place objects where each object contains lat, long, id (optional), location (optional)
 * @param {string} units: (imperial | metric )
 * @param {string} lang: (en | fr | sv )
 * @returns array of objects where each object contains the weather data for a particular place
 */

export default async function getWeather(options) {
  const { places, units, lang } = options;
  const promises = [];

  places.forEach((place) => {
    const params = {
      id: place.id,
      location: place.location,
      lat: place.lat,
      long: place.long,
      units,
      lang,
    };
    const promise = getPlaceWeather(params);
    promises.push(promise);
  });

  const placesWeather = await Promise.all(promises);
  return placesWeather;
}

/**
 * OpenWeather
 * @param {string} lat: latitude, required by OpenWeather
 * @param {string} long: longitude, required by OpenWeather
 * @param {string} units: (imperial | metric ), required by OpenWeather
 * @param {string} lang: (en | fr | sv ), OpenWeather option
 * @param {string} id:
 *   - used for adding/deleting places from localStorage
 *   - pass to server so server can include in the response object
 * @param {string} location:
 *  - location is not provided by OpenWeather
 *  - pass to server so server can include in the response object
 */

async function getPlaceWeather(params) {
  const { lat, long, units, lang, id, location } = params;

  const res = await axios.get(URL, {
    params: { lat, long, units, lang, id, location },
    timeout: `${TIMEOUT}`,
  });
  return res.data;
}
