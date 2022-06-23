if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const cors = require('cors')
const axios = require('axios')
const app = express()
const { v4 } = require('uuid')
const { getCardinalDirection, getUVIndexLevel } = require('./utils.js')

//with no params, cors() allows requests from any url
app.use(cors())

//enable the ability to parse req.query
app.use(express.urlencoded({ extended: true }))

//prevent open handles when running unit tests
if (process.env.SERVER_UNIT_TEST !== 'true') {
  app.listen(3001)
}

app.get('/weather', (req, res) => {
  let { lat, long, id, location } = req.query

  //if no id, generate the id
  id = id === '' ? v4() : id

  axios
    .get('https://api.openweathermap.org/data/3.0/onecall', {
      params: { lat: lat, lon: long, appid: process.env.API_KEY, units: 'imperial', exclude: 'minutely' },
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
        },
        current: parseCurrentWeather(data),
        daily: parseDailyWeather(data),
        hourly: parseHourlyWeather(data),
      })
    })
    .catch((e) => {
      console.log(e)
      res.sendStatus(500)
    })
})

function parseCurrentWeather({ current, daily }) {
  const { pop, temp } = daily[0]

  return {
    timestamp: current.dt * 1000, //convert Unix (seconds) to JS (milliseconds)
    description: current.weather[0].description,
    icon: current.weather[0].icon,
    temp: Math.round(current.temp),
    high: Math.round(temp.max),
    low: Math.round(temp.min),
    feelsLike: Math.round(current.feels_like),

    //visibility is provided in meters, so convert to miles and round to one decimal place
    //TODO: Do not convert to miles if units are metric
    visibility: Math.round((current.visibility / 1609.344) * 10) / 10,
    precip: Math.round(pop * 100),
    dewPoint: Math.round(current.dew_point),
    sunrise: current.sunrise * 1000,
    sunset: current.sunset * 1000,
    uvIndex: current.uvi,
    uvLevel: getUVIndexLevel(current.uvi),
    humidity: Math.round(current.humidity),
    windSpeed: Math.round(current.wind_speed),
    windDirection: getCardinalDirection(current.wind_deg),
    windDeg: Math.round(current.wind_deg),
  }
}

function parseDailyWeather({ daily }) {
  return daily.slice(1).map((day) => {
    return {
      timestamp: day.dt * 1000,
      description: day.weather[0].description,
      icon: day.weather[0].icon,
      high: Math.round(day.temp.max),
      low: Math.round(day.temp.min),
      precip: Math.round(day.pop * 100),
      humidity: Math.round(day.humidity),
      windSpeed: Math.round(day.wind_speed),
      windDirection: getCardinalDirection(day.wind_deg),
      windDeg: Math.round(day.wind_deg),
    }
  })
}

const HOUR_IN_SECONDS = 3600
function parseHourlyWeather({ hourly, current }) {
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
        windSpeed: Math.round(hour.wind_speed),
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
