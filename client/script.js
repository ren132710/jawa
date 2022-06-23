/*
TODO:
City/Places Search
 - hide api key

  cypress testing:
 - test: delete place
 - test: add place
 - test: localStorage

 prefs
 - open preferences, see Bancor's ||| popover
 - themes:
  -light, morning, sunrise, desert, winter
 - night, dusk, new moon
 - Units (Imperial, Metric)
 - use ::before pseudo element to create custom radio buttons

 ui
 - refactor css properties into variables
 - use ::after pseudo element for UNIT, degrees, wind speed, percent - so we can remove the spans from html
 - create NavBar for JAWA logo and Prefs |||, review Bancor/Ren, position: fixed. Push navBar to bottom of screen in mobile context
 - build prefs pop-up overlay, use transform property for menu button
 - modernize savePlace button
 - modernize deletePlace button - when hovering on place card, delete X top corner of place card border (similar to macos notifications)
 - box-shadow on place card when hovering
 - globally change rbga to hsl?
 - onFocus - support tabbing between place cards and to New Place button
 - use margin: 0 auto; to center content in mobile context
 - try font-family Montserrat (from google fonts)

 final clean
  - remove console.logs
*/

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

import axios from 'axios'
const { v4 } = require('uuid')
import {
  formatMonth,
  formatDayOfMonth,
  formatDayOfWeek,
  formatDayOfWeekShort,
  formatTime,
  formatZonedTime,
  formatZonedHour,
} from './date-utils.js'
import { getIconUrl, parseIconUrl } from './helpers.js'

const LOCAL_STORAGE_PREFIX = 'JAWA'
const PLACES_STORAGE_KEY = `${LOCAL_STORAGE_PREFIX}-Places`

const DEFAULT_PLACES = [
  {
    id: '0498724f-63ce-4b17-81d3-9b3fbd4eb443',
    location: 'stockholm',
    lat: 59.3293,
    long: 18.0685,
  },
  // {
  //   id: '90f3d018-bbd3-45be-9c11-debbff73fb6c',
  //   location: 'san francisco',
  //   lat: 37.7749295,
  //   long: -122.4194155,
  // },
  // {
  //   id: '6b819c6d-c8d4-4f2a-94c1-6eec48c6d8c8',
  //   location: 'montreal',
  //   lat: 45.5016889,
  //   long: -73.567256,
  // },
  // {
  //   id: 'c9ae7c46-81e4-4c9d-a933-bb3c8d14fc87',
  //   location: 'new york',
  //   lat: 40.7127753,
  //   long: -74.0059728,
  // },
]

/*
 * initialize page
 */

let places = []
let placesWeather = []

getPlacesFromLocalStorage()
  .then((savedPlaces) => {
    places = savedPlaces
    console.log('from localStorage ', savedPlaces)
  })
  .then(getPlacesWeather)
  .then(initialize)
  .catch((err) => {
    console.log('ERROR: ', err)
    alert(`There was a problem loading your places.`)
  })

function initialize() {
  console.log('places initialized: ', places)
  console.log('placesWeather initialized: ', placesWeather)
  renderPlacesWeather()
  renderWeather(placesWeather[0])
}

async function getPlacesWeather() {
  let promises = []

  places.forEach((place) => {
    const promise = getWeather(place.lat, place.long, place.id, place.location)
    promises.push(promise)
  })

  //TODO: should use Promise.allSettled instead??
  await Promise.all(promises).then((data) => {
    placesWeather = data
  })
}

/*
 * event listeners
 */

function addGlobalEventListener(type, selector, callback) {
  document.addEventListener(type, (e) => {
    if (e.target.matches(selector)) callback(e)
  })
}

addGlobalEventListener('click', '#btnNewPlace', () => {
  newPlace()
})

addGlobalEventListener('click', '#btnDeletePlace', (e) => {
  console.log(e.target.closest('[data-place-card]').dataset.id)
  deletePlace(e.target.closest('[data-place-card]').dataset.id)
})

/*
 * axios call
 * @param {string} lat: latitude, required by OpenWeather for weather data
 * @param {string} long: longitude, required by OpenWeather for weather data
 * @param {string} id:
 *    - If known, pass to server so server can include in the response
 *    - Otherwise, pass empty string and server will generate the id
 *    - Necessary for adding/deleting places from localStorage
 * @param {string} location: pass to server so server can include in the response
 *
 * NOTE: params that are null or undefined are not rendered in the axios.get URL
 */

async function getWeather(lat, long, id, location) {
  try {
    const res = await axios.get('http://localhost:3001/weather', {
      params: { lat, long, id, location },
      timeout: 5000,
    })
    return res.data
  } catch (e) {
    console.log(`ERROR: ${e}`)
    alert('Fetching weather encountered an issue. Please try again.')
  }
}

/*
 * google autocomplete
 */

const placeSearch = document.querySelector('[data-place-search]')

const autocomplete = new google.maps.places.Autocomplete(placeSearch, {
  types: ['geocode'],
  fields: ['place_id', 'name', 'geometry.location'],
})

autocomplete.addListener('place_changed', () => {
  const place = autocomplete.getPlace()
  // if (place == null) return
  if (!place.geometry) return
  const lat = place.geometry.location.lat()
  const long = place.geometry.location.lng()
  const location = place.name

  const res = getWeather(lat, long, (id = ''), location)
  res.then((data) => {
    console.log('new weather: ', data)
    renderWeather(data)
  })
})

/*
 * render places weather
 */

const placesContainer = document.querySelector('.places-container')
const templatePlaceCard = document.querySelector('#template-place-card')
function renderPlacesWeather() {
  placesContainer.innerHTML = ''

  placesWeather.forEach((place) => {
    const element = templatePlaceCard.content.cloneNode(true)
    const card = element.querySelector('.place-card')
    card.dataset.id = place.coordinates.id
    card.dataset.location = place.coordinates.location
    card.dataset.lat = place.coordinates.lat
    card.dataset.long = place.coordinates.long
    card.dataset.mapsPlaceId = place.coordinates.maps_place_id
    card.querySelector('[data-location').innerText = place.coordinates.location
    card.querySelector('[data-icon]').src = getIconUrl(place.current.icon)
    card.querySelector('[data-icon]').alt = place.current.description
    card.querySelector('[data-hl] > [data-high]').innerText = place.current.high
    card.querySelector('[data-hl] > [data-low]').innerText = place.current.low
    card.addEventListener('click', (e) => {
      if (e.target.id === 'btnDeletePlace') return
      renderSavedPlaceWeather(e.target.dataset.id)
    })
    placesContainer.append(element)
  })
}

/*
 * render weather
 */

function renderSavedPlaceWeather(id) {
  const index = placesWeather.findIndex((place) => {
    return place.coordinates.id === id
  })
  renderWeather(placesWeather[index])
}

function renderWeather({ coordinates, current, daily, hourly }) {
  document.body.classList.remove('blurred')
  renderCurrentWeather({ coordinates, current })
  renderDailyWeather(daily)
  renderHourlyWeather(hourly, coordinates)
}

//render current weather
const currentTopLeft = document.querySelector('.current-top-left')
const currentTopRight = document.querySelector('.current-top-right')
const currentBotLeft = document.querySelector('.current-bottom-left')
const currentBotRight = document.querySelector('.current-bottom-right')
function renderCurrentWeather({ coordinates, current }) {
  //sub title
  document.querySelector('[data-current-dt').textContent = `${formatDayOfWeekShort(
    current.timestamp
  )} ${formatDayOfMonth(current.timestamp)} ${formatMonth(current.timestamp)} ${formatTime(current.timestamp)}`

  //top left quadrant
  currentTopLeft.querySelector('[data-id]').dataset.id = coordinates.id
  currentTopLeft.querySelector('[data-location]').dataset.location = coordinates.location
  currentTopLeft.querySelector('[data-location]').textContent = coordinates.location
  currentTopLeft.querySelector('[data-current-icon').src = getIconUrl(current.icon, { size: 'large' })
  currentTopLeft.querySelector('[data-current-icon').alt = current.description

  //to right quadrant
  currentTopRight.querySelector('[data-current-lat').textContent = coordinates.lat
  currentTopRight.querySelector('[data-current-long').textContent = coordinates.long
  currentTopRight.querySelector('[data-current-high').textContent = current.high
  currentTopRight.querySelector('[data-current-low').textContent = current.low
  currentTopRight.querySelector('[data-current-temp').textContent = current.temp
  currentTopRight.querySelector('[data-current-fl').textContent = current.feelsLike
  currentTopRight.querySelector('[data-current-description').textContent = current.description
  currentTopRight.querySelector('[data-current-precip').textContent = current.precip
  currentTopRight.querySelector('[data-current-visibility').textContent = current.visibility

  //bottom left quadrant
  currentBotLeft.querySelector('[data-current-uv-index]').textContent = current.uvIndex
  currentBotLeft.querySelector('[data-current-uv-level]').textContent = current.uvLevel
  currentBotLeft.querySelector('[data-current-humidity]').textContent = current.humidity
  currentBotLeft.querySelector('[data-current-wind-speed]').textContent = current.windSpeed
  currentBotLeft.querySelector('[data-current-wind-direction]').textContent = current.windDirection

  //bottom right quadrant
  currentBotRight.querySelector('[data-current-dew-point').textContent = current.dewPoint
  currentBotRight.querySelector('[data-current-sunrise').textContent = formatZonedTime(
    current.sunrise,
    coordinates.timezone
  )
  currentBotRight.querySelector('[data-current-sunset').textContent = formatZonedTime(
    current.sunset,
    coordinates.timezone
  )
}

//render daily weather
const dailyContainer = document.querySelector('.daily-container')
const templateDailyCard = document.querySelector('#template-daily-card')
function renderDailyWeather(daily) {
  dailyContainer.innerHTML = ''
  daily.forEach((day) => {
    const element = templateDailyCard.content.cloneNode(true)
    const card = element.querySelector('.daily-card')
    card.querySelector('[data-daily-icon]').src = getIconUrl(day.icon)
    card.querySelector('[data-daily-icon]').alt = day.description
    card.querySelector('[data-daily-date').textContent = formatDayOfWeek(day.timestamp)
    card.querySelector('[data-daily-description').textContent = day.description
    card.querySelector('[data-hl] > [data-daily-high]').textContent = day.high
    card.querySelector('[data-hl] > [data-daily-low]').textContent = day.low
    card.querySelector('[data-daily-humidity').textContent = day.humidity
    card.querySelector('[data-daily-wind-speed]').textContent = day.windSpeed
    card.querySelector('[data-daily-wind-direction]').textContent = day.windDirection
    dailyContainer.append(card)
  })
}

//render hourly weather
const hourlyContainer = document.querySelector('.hourly-container')
const templateHourRow = document.querySelector('#template-hour-row')
function renderHourlyWeather(hourly, coordinates) {
  console.log('timezone: ', coordinates.timezone)
  document.querySelector('[data-hour-timezone]').textContent = coordinates.timezone
  hourlyContainer.innerHTML = ''
  hourly
    .slice(0, 24)
    //get every other hour
    .filter((h, i) => i % 2 === 1)
    .forEach((hour) => {
      const element = templateHourRow.content.cloneNode(true)
      const row = element.querySelector('.hour-row')
      row.querySelector('[data-hour-date]').textContent = formatDayOfWeek(hour.timestamp)
      row.querySelector('[data-hour]').textContent = formatZonedHour(hour.timestamp, coordinates.timezone)
      row.querySelector('[data-hour-icon]').src = getIconUrl(hour.icon)
      row.querySelector('[data-hour-icon]').alt = hour.description
      row.querySelector('[data-hour-temp]').textContent = hour.temp
      row.querySelector('[data-hour-precip]').textContent = hour.precip
      row.querySelector('[data-hour-wind-speed]').textContent = hour.windSpeed
      row.querySelector('[data-hour-wind-direction]').textContent = hour.windDirection
      row.querySelector('[data-hour-humidity]').textContent = hour.humidity
      row.querySelector('[data-hour-uv-level]').textContent = hour.uvLevel
      hourlyContainer.append(row)
    })
}

/*
 * localStorage functions
 */

//make localStorage.getItem thenable
function getPlacesFromLocalStorage() {
  return new Promise((resolve, reject) => {
    // localStorage.clear()
    const isNull = JSON.parse(localStorage.getItem(PLACES_STORAGE_KEY))

    if (isNull == null) {
      setDefaultPlaces()
    }

    const savedPlaces = JSON.parse(localStorage.getItem(PLACES_STORAGE_KEY))
    if (true) {
      resolve(savedPlaces)
    } else {
      reject(err)
    }
  })
}

/**
 * make localStorage.setItem thenable
 * per MDN, if the value after the await operator is not a Promise,
 * converts the value to a resolved Promise, and waits for it
 */
async function setDefaultPlaces() {
  await localStorage.setItem(PLACES_STORAGE_KEY, JSON.stringify(DEFAULT_PLACES))
}

async function savePlaces() {
  await localStorage.setItem(PLACES_STORAGE_KEY, JSON.stringify(places))
}

function newPlace() {
  const newPlace = {
    id: currentTopLeft.querySelector('[data-id').dataset.id,
    location: currentTopLeft.querySelector('[data-location]').innerText.toLowerCase(),
    lat: currentTopRight.querySelector('[data-current-lat]').innerText,
    long: currentTopRight.querySelector('[data-current-long]').innerText,
  }

  places.push(newPlace)

  //limit the number of saved places to 10
  if (places.length >= 10) {
    document.querySelector('[data-new-place]').classList.add('btn-new-place-disabled')
  }
  savePlaces().then(getPlacesWeather).then(renderPlacesWeather)
  console.log('new places: ', places)
}

function deletePlace(cardId) {
  places = places.filter((place) => place.id !== cardId)

  if (places.length < 10) {
    document.querySelector('[data-new-place]').classList.remove('btn-new-place-disabled')
  }

  savePlaces().then(getPlacesWeather).then(renderPlacesWeather)
}
