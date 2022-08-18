import axios from 'axios'
const AXIOS_TIMEOUT = process.env.AXIOS_TIMEOUT || 10000 //allow time for cloud containers to wake up
const SERVER = process.env.JAWA_SERVER || 'localhost'
const PORT = '8080' //when 3001 is blocked by local network, use 8080
const JAWA_SERVER = process.env.CLOUD_JAWA_SERVER || `${SERVER}:${PORT}` // 'my-app-server.herokuapp.com' || 'localhost:3001'
const URL = process.env.NODE_ENV === 'production' ? `https://${JAWA_SERVER}/weather` : `http://${JAWA_SERVER}/weather`
console.log('URL: ', URL)

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
    const res = await axios.get(URL, {
      params: { lat, long, units, lang, id, location },
      timeout: `${AXIOS_TIMEOUT}`,
    })
    return res.data
  } catch (e) {
    console.error(`ERROR: ${e}`)
    alert('Fetching weather encountered an issue. Please try again.')
  }
}
