// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').config()
//   console.log(process.env.API_KEY)
// }
const express = require('express')
const cors = require('cors')
const axios = require('axios')
require('dotenv').config()
const app = express()
const { getCardinalDirection, getUVIndexLevel } = require('./utils.js')

//with no params, allows requests from any url
app.use(cors())

//enable the ability to parse req.query
app.use(express.urlencoded({ extended: true }))

app.listen(3001)

app.get('/weather', (req, res) => {
  const { lat, long } = req.query

  axios
    .get('https://api.openweathermap.org/data/3.0/onecall', {
      params: { lat: lat, lon: long, appid: process.env.API_KEY, units: 'imperial', exclude: 'minutely' },
      timeout: 5000,
    })
    .then(({ data }) => {
      res.json({
        // data // parse server-side
        coordinates: { lat: data.lat, long: data.lon },
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
  const { temp } = daily[0]

  return {
    timestamp: current.dt * 1000, //convert Unix time to JS time
    description: current.weather[0].description,
    icon: current.weather[0].icon,
    temp: Math.round(current.temp),
    high: Math.round(temp.max),
    low: Math.round(temp.min),
    feelsLike: Math.round(current.feels_like),

    // convert meters to miles, round to one decimal place
    visibility: Math.round((current.visibility / 1609.344) * 10) / 10,
    dewPoint: Math.round(current.dew_point),

    //TODO: How to adjust for DST??
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
        icon: hour.weather[0].icon,
        temp: Math.round(hour.temp),
        feelsLike: Math.round(hour.feels_like),
        humidity: Math.round(hour.humidity),
        windSpeed: Math.round(hour.wind_speed),
        windDirection: getCardinalDirection(hour.wind_deg),
        windDeg: Math.round(hour.wind_deg),
        uvIndex: hour.uvi,
        uvLevel: getUVIndexLevel(hour.uvi),
      }
    })
}
