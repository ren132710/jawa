import axios from 'axios';

const TIMEOUT = import.meta.env.VITE_AXIOS_TIMEOUT;
const WEATHER_SERVER = import.meta.env.VITE_JAWA_SERVER;
const URL = `https://${WEATHER_SERVER}/weather`;
console.log('URL:', URL);

/**
 * getWeather
 * @param {array} places: array of place objects where each object contains lat, long, id, location
 * @param {string} units: (imperial | metric )
 * @param {string} lang: (en | fr | sv )
 * @returns array of objects where each object contains the weather data for a place
 */

export default async function getWeather(options) {
  const { places, units, lang } = options;
  const placesWeather = await getPlacesWeather(places, units, lang);
  return placesWeather;
}

async function getPlacesWeather(places, units, lang) {
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

  const results = await Promise.all(promises);
  return results;
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
  try {
    const res = await axios.get(URL, {
      params: { lat, long, units, lang, id, location },
      timeout: `${TIMEOUT}`,
    });
    return res.data;
  } catch (e) {
    console.error(
      `Fetching weather using getWeather.js encountered an issue: ${e}`
    );
  }
}
