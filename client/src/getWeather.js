import axios from 'axios'
const SERVER = process.env.JAWA_SERVER || 'localhost'
const PORT = process.env.JAWA_PORT || '3001'
const HTTP_PROTOCOL = process.env.HTTP_PROTOCOL || 'http'
const AXIOS_TIMEOUT = process.env.AXIOS_TIMEOUT || 10000 //allow time for server container to wake up
console.log('SERVER: ', SERVER)
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

export async function getWeather(params) {
  const { lat, long, units, lang, id, location } = params
  try {
    const res = await axios.get(`${HTTP_PROTOCOL}://${SERVER}:${PORT}/weather`, {
      params: { lat, long, units, lang, id, location },
      timeout: `${AXIOS_TIMEOUT}`,
    })
    return res.data
  } catch (e) {
    console.error(`ERROR: ${e}`)
    alert('Fetching weather encountered an issue. Please try again.')
  }
}
