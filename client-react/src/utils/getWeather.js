import axios from 'axios';

const TIMEOUT = import.meta.env.VITE_AXIOS_TIMEOUT;
const WEATHER_SERVER = import.meta.env.VITE_JAWA_SERVER;
const URL = `https://${WEATHER_SERVER}/weather`;
console.log('URL:', URL);

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

export default async function getWeather(params) {
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
