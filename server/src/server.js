if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const cors = require('cors')
const axios = require('axios')
const app = express()
const { getCardinalDirection, getUVIndexLevel } = require('./utils.js')
const PORT = process.env.PORT_LISTEN
const API_KEY = process.env.API_KEY
const URL = 'https://api.openweathermap.org/data/3.0/onecall'

//with no params, cors() allows requests from any url
app.use(cors())

//enable the ability to parse req.query
app.use(express.urlencoded({ extended: true }))

//prevent open handles when running unit tests
if (process.env.SERVER_UNIT_TEST !== 'true') {
  app.listen(PORT)
}

app.get('/weather', (req, res) => {
  const { lat, long, units, lang, id, location } = req.query

  axios
    .get(URL, {
      params: { lat: lat, lon: long, units: units, lang: lang, appid: API_KEY, exclude: 'minutely' },
      timeout: 5000,
    })
    .then(({ data }) => {
      res.json({
        coordinates: {
          id,
          location,
          lat: data.lat,
          long: data.lon,
          timezone: data.timezone,
          timezone_offset: data.timezone_offset,
          units,
          lang,
        },
        current: parseCurrentWeather(data, units),
        daily: parseDailyWeather(data, units),
        hourly: parseHourlyWeather(data, units),
      })
    })
    .catch((e) => {
      console.log(e)
      res.sendStatus(500)
    })
})

function parseCurrentWeather({ current, daily }, units) {
  const { pop, temp } = daily[0]
  return {
    timestamp: current.dt * 1000, //convert Unix (seconds) to JS (milliseconds)
    description: current.weather[0].description,
    icon: current.weather[0].icon,
    temp: Math.round(current.temp),
    high: Math.round(temp.max),
    low: Math.round(temp.min),
    feelsLike: Math.round(current.feels_like),
    //visibility is always given in meters, so convert to (miles | kilometers) and round to one decimal place
    visibility:
      units === 'imperial'
        ? Math.round((current.visibility / 1609.344) * 10) / 10
        : Math.round((current.visibility / 1000) * 10) / 10,
    precip: Math.round(pop * 100),
    dewPoint: Math.round(current.dew_point),
    sunrise: current.sunrise * 1000,
    sunset: current.sunset * 1000,
    uvIndex: current.uvi,
    uvLevel: getUVIndexLevel(current.uvi),
    humidity: Math.round(current.humidity),
    //metric wind speed is given in m/s, so convert to km/h (1 m/s = 3.6 km/h)
    windSpeed: units === 'imperial' ? Math.round(current.wind_speed) : Math.round(current.wind_speed * 3.6),
    windDirection: getCardinalDirection(current.wind_deg),
    windDeg: Math.round(current.wind_deg),
  }
}

function parseDailyWeather({ daily }, units) {
  return daily.slice(1).map((day) => {
    return {
      timestamp: day.dt * 1000,
      description: day.weather[0].description,
      icon: day.weather[0].icon,
      high: Math.round(day.temp.max),
      low: Math.round(day.temp.min),
      precip: Math.round(day.pop * 100),
      humidity: Math.round(day.humidity),
      windSpeed: units === 'imperial' ? Math.round(day.wind_speed) : Math.round(day.wind_speed * 3.6),
      windDirection: getCardinalDirection(day.wind_deg),
      windDeg: Math.round(day.wind_deg),
    }
  })
}

const HOUR_IN_SECONDS = 3600
function parseHourlyWeather({ hourly, current }, units) {
  return hourly
    .filter((hour) => hour.dt > current.dt - HOUR_IN_SECONDS)
    .map((hour) => {
      return {
        timestamp: hour.dt * 1000,
        description: hour.weather[0].description,
        icon: hour.weather[0].icon,
        temp: Math.round(hour.temp),
        precip: Math.round(hour.pop * 100),
        humidity: Math.round(hour.humidity),
        windSpeed: units === 'imperial' ? Math.round(hour.wind_speed) : Math.round(hour.wind_speed * 3.6),
        windDirection: getCardinalDirection(hour.wind_deg),
        windDeg: Math.round(hour.wind_deg),
        uvIndex: hour.uvi,
        uvLevel: getUVIndexLevel(hour.uvi),
      }
    })
}

module.exports = {
  parseCurrentWeather,
  parseDailyWeather,
  parseHourlyWeather,
}
