// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').config()
//   console.log(process.env.API_KEY)
// }
const express = require('express')
const cors = require('cors')
const axios = require('axios')
require('dotenv').config()
const app = express()
//with no params, allows requests from any url
app.use(cors())

//enable the ability to parse parameters from req.query
app.use(express.urlencoded({ extended: true }))

app.listen(3001)

app.get('/weather', (req, res) => {
  const { lat, long } = req.query

  //TODO: Try API 3.0
  axios
    .get('https://api.openweathermap.org/data/3.0/onecall', {
      params: { lat: lat, lon: long, appid: process.env.API_KEY, units: 'imperial', exclude: 'minutely' },
      timeout: 5000,
    })
    .then(({ data }) => {
      res.json({
        // data, parse it server side
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
    timestamp: current.dt * 1000,
    description: current.weather[0].description,
    icon: current.weather[0].icon,
    temp: Math.round(current.temp),
    high: Math.round(temp.max),
    low: Math.round(temp.min),
    feelsLike: Math.round(current.feels_like),
    visibility: Math.round(current.visibility / 1609.344), // convert meters to miles
    dewPoint: Math.round(current.dew_point),
    sunrise: current.sunrise * 1000,
    sunset: current.sunrise * 1000,
    uvIndex: current.uvi,
    uvLevel: getUVIndexLevel(current.uvi),
    humidity: Math.round(current.humidity),
    windSpeed: Math.round(current.wind_speed),
    windDirection: getCardinalDirection(current.wind_deg),
  }
}

function parseDailyWeather({ daily }) {
  return daily.slice(1).map((day) => {
    return {
      timestamp: day.dt * 1000, //convert Unix time to JS time
      description: day.weather[0].description,
      icon: day.weather[0].icon,
      high: Math.round(day.temp.max),
      low: Math.round(day.temp.min),
      humidity: Math.round(day.humidity),
      windSpeed: Math.round(day.wind_speed),
      windDirection: getCardinalDirection(day.wind_deg),
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
      }
    })
}

function getCardinalDirection(angle) {
  // const directions = ['↑ N', '↗ NE', '→ E', '↘ SE', '↓ S', '↙ SW', '← W', '↖ NW'];
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return directions[Math.round(angle / 45) % 8]
}

function getUVIndexLevel(uvi) {
  if (Math.floor(uvi) > 11) return 'extremely high'
  const uvIndexLevels = [
    'low',
    'low',
    'medium',
    'medium',
    'medium',
    'high',
    'high',
    'very high',
    'very high',
    'very high',
    'extremely high',
  ]
  return uvIndexLevels[Math.floor(uvi) - 1]
}
