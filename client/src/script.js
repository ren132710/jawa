/*
TODO:
 prefs
 - units: imperial, metric
 - themes:
  -light, morning, sunrise, desert, winter
 - night, dusk, new moon
 - Units (Imperial, Metric)
 - use ::before pseudo element to create custom radio buttons

 ui
 - create NavBar for JAWA logo and Prefs |||
      - review Bancor/Ren, transparent, then white when page scroll, position: fixed at top of screen
 - prefs modal
     - review MDN menu bar <--Use this with menu Class
 - style search box using google classes

 final clean
  - remove console.logs
*/

import { Loader } from '@googlemaps/js-api-loader'
import axios from 'axios'
import {
  formatMonth,
  formatDayOfMonth,
  formatDayOfWeek,
  formatDayOfWeekShort,
  formatTime,
  formatZonedTime,
  formatZonedHour,
} from './dateUtils.js'
import { getIconUrl } from './parse.js'
import { getLocalStorage, setLocalStorage } from './localStorage.js'
import { newGlobalEventListener, qs } from './domUtils.js'
const { v4 } = require('uuid')

const LOCAL_STORAGE_PREFIX = 'JAWA'
const PLACES_STORAGE_KEY = `${LOCAL_STORAGE_PREFIX}-Places`
const PLACES_CAP = 6

const DEFAULT_PLACES = [
  // { id: '0498724f-63ce-4b17-81d3-9b3fbd4eb443', location: 'stockholm', lat: 59.3293, long: 18.0686 },
  // { id: '905e58e1-5510-4535-b4c8-2ed30045772d', location: 'austin', lat: 30.2672, long: -97.7431 },
  // { id: '6b819c6d-c8d4-4f2a-94c1-6eec48c6d8c8', location: 'montreal', lat: 45.5017, long: -73.5673 },
  { id: 'c9ae7c46-81e4-4c9d-a933-bb3c8d14fc87', location: 'new york', lat: 40.7128, long: -74.006 },
]

/**
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
    console.error('ERROR: ', err)
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

  await Promise.all(promises).then((data) => {
    placesWeather = data
  })
}

/**
 * axios
 * @param {string} lat: latitude, required by OpenWeather for weather data
 * @param {string} long: longitude, required by OpenWeather for weather data
 * @param {string} id:
 *   - used for adding/deleting places from localStorage
 *   - pass to server so server can include in the response object
 * @param {string} location:
 *  - location is not provided by OpenWeather
 *  - pass to server so server can include in the response object
 */

async function getWeather(lat, long, id, location) {
  try {
    const res = await axios.get('http://localhost:3001/weather', {
      params: { lat, long, id, location },
      timeout: 5000,
    })
    return res.data
  } catch (e) {
    console.error(`ERROR: ${e}`)
    alert('Fetching weather encountered an issue. Please try again.')
  }
}

/**
 * google autocomplete
 */

const loader = new Loader({
  apiKey: process.env.API_KEY,
  libraries: ['places'],
})

const placeSearch = document.querySelector('[data-place-search]')
loader.load().then((google) => {
  const autocomplete = new google.maps.places.Autocomplete(placeSearch, {
    //types: ['(cities)'],
    types: ['geocode'],
    //componentRestrictions: { country: 'us' },
    fields: ['name', 'geometry.location'],
  })

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace()
    if (!place.geometry) return
    const lat = place.geometry.location.lat()
    const long = place.geometry.location.lng()
    const location = place.name
    const id = v4()

    const res = getWeather(lat, long, id, location)
    res.then((data) => {
      console.log('new weather: ', data)
      renderWeather(data)
    })
  })
})

//hide btnDeletePlace when reverse tabbing to search box
newGlobalEventListener('focusin', '[data-place-search]', (e) => {
  if (e.relatedTarget == null) return
  if (e.relatedTarget.hasAttribute('data-place-card')) {
    qs('#btnDeletePlace', e.relatedTarget).hidden = true
  }
})

/**
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
    qs('[data-card-location]', card).innerText = place.coordinates.location
    qs('[data-card-icon]', card).src = getIconUrl(place.current.icon)
    qs('[data-card-icon]', card).alt = place.current.description
    qs('[data-card-hl] > [data-card-high]', card).innerText = place.current.high
    qs('[data-card-hl] > [data-card-low]', card).innerText = place.current.low

    //mouse events
    card.addEventListener('click', (e) => {
      if (e.target.id === 'btnDeletePlace') return

      const placeCard = e.target.closest('.place-card')
      if (placeCard == null) return
      renderSavedPlaceWeather(placeCard.dataset.id)
    })

    card.addEventListener('mouseenter', (e) => {
      const placeCard = e.target.closest('.place-card')
      if (placeCard == null) return
      const btn = qs('#btnDeletePlace', placeCard)
      btn.hidden = false
    })

    card.addEventListener('mouseleave', (e) => {
      const placeCard = e.target.closest('.place-card')
      if (placeCard == null) return
      const btn = qs('#btnDeletePlace', placeCard)
      btn.hidden = true
    })

    //keyboard events
    card.addEventListener('keypress', (e) => {
      if (!e.key === 'Enter') return
      const placeCard = e.target.closest('.place-card')
      if (placeCard == null) return
      renderSavedPlaceWeather(placeCard.dataset.id)
    })

    card.addEventListener('focusin', (e) => {
      //show delete button when place card gets focus
      const placeCard = e.target.closest('.place-card')
      if (placeCard == null) return
      const btn = qs('#btnDeletePlace', placeCard)
      btn.hidden = false

      //reverse tab does not recognize the delete button, so handle differently
      if (e.target.hasAttribute('data-place-card') && e.relatedTarget.hasAttribute('data-place-card')) {
        qs('#btnDeletePlace', e.relatedTarget).hidden = true
      }
    })

    placesContainer.append(element)
  })
}

/**
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
function renderCurrentWeather({ coordinates, current }) {
  //sub title
  qs('[data-current-dt').textContent = `${formatDayOfWeekShort(current.timestamp)} ${formatDayOfMonth(
    current.timestamp
  )} ${formatMonth(current.timestamp)} ${formatTime(current.timestamp)}`

  //top left quadrant
  qs('[data-current-id]').dataset.currentId = coordinates.id
  qs('[data-current-location]').dataset.currentLocation = coordinates.location
  qs('[data-current-location]').textContent = coordinates.location
  qs('[data-current-icon]').src = getIconUrl(current.icon, { size: 'large' })
  qs('[data-current-icon]').alt = current.description

  //to right quadrant
  qs('[data-current-lat]').textContent = coordinates.lat
  qs('[data-current-long]').textContent = coordinates.long
  qs('[data-current-high]').textContent = current.high
  qs('[data-current-low]').textContent = current.low
  qs('[data-current-temp]').textContent = current.temp
  qs('[data-current-fl]').textContent = current.feelsLike
  qs('[data-current-description]').textContent = current.description
  qs('[data-current-precip]').textContent = current.precip
  qs('[data-current-visibility').textContent = current.visibility

  //bottom left quadrant
  qs('[data-current-uv-index]').textContent = current.uvIndex
  qs('[data-current-uv-level]').textContent = current.uvLevel
  qs('[data-current-humidity]').textContent = current.humidity
  qs('[data-current-wind-speed]').textContent = current.windSpeed
  qs('[data-current-wind-direction]').textContent = current.windDirection

  //bottom right quadrant
  qs('[data-current-dew-point]').textContent = current.dewPoint
  qs('[data-current-sunrise]').textContent = formatZonedTime(current.sunrise, coordinates.timezone)
  qs('[data-current-sunset]').textContent = formatZonedTime(current.sunset, coordinates.timezone)
}

//render daily weather
const dailyContainer = document.querySelector('.daily-container')
const templateDailyCard = document.querySelector('#template-daily-card')
function renderDailyWeather(daily) {
  dailyContainer.innerHTML = ''
  daily.forEach((day) => {
    const element = templateDailyCard.content.cloneNode(true)
    const card = element.querySelector('.daily-card')
    qs('[data-daily-icon]', card).src = getIconUrl(day.icon)
    qs('[data-daily-icon]', card).alt = day.description
    qs('[data-daily-date]', card).textContent = formatDayOfWeek(day.timestamp)
    qs('[data-daily-description]', card).textContent = day.description
    qs('[data-hl] > [data-daily-high]', card).textContent = day.high
    qs('[data-hl] > [data-daily-low]', card).textContent = day.low
    qs('[data-daily-humidity]', card).textContent = day.humidity
    qs('[data-daily-wind-speed]', card).textContent = day.windSpeed
    qs('[data-daily-wind-direction]', card).textContent = day.windDirection
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
      qs('[data-hour-date]', row).textContent = formatDayOfWeek(hour.timestamp)
      qs('[data-hour]', row).textContent = formatZonedHour(hour.timestamp, coordinates.timezone)
      qs('[data-hour-icon]', row).src = getIconUrl(hour.icon)
      qs('[data-hour-icon]', row).alt = hour.description
      qs('[data-hour-temp]', row).textContent = hour.temp
      qs('[data-hour-precip]', row).textContent = hour.precip
      qs('[data-hour-wind-speed]', row).textContent = hour.windSpeed
      qs('[data-hour-wind-direction]', row).textContent = hour.windDirection
      qs('[data-hour-humidity]', row).textContent = hour.humidity
      qs('[data-hour-uv-level]', row).textContent = hour.uvLevel
      hourlyContainer.append(row)
    })
}

/**
 * localStorage (thenable)
 */

async function getPlacesFromLocalStorage() {
  const isStorageEmpty = await getLocalStorage(PLACES_STORAGE_KEY)
  if (isStorageEmpty == null || isStorageEmpty.length < 1) setPlaces(PLACES_STORAGE_KEY, DEFAULT_PLACES)
  const savedPlaces = await getLocalStorage(PLACES_STORAGE_KEY)
  return savedPlaces
}

async function setPlaces(key, value) {
  await setLocalStorage(key, value)
}

/**
 * new place
 */

newGlobalEventListener('click', '#btnNewPlace', newPlace)

function newPlace() {
  const newPlace = {
    id: v4(),
    location: qs('[data-current-location]').innerText.toLowerCase(),
    lat: qs('[data-current-lat]').innerText,
    long: qs('[data-current-long]').innerText,
  }
  places.push(newPlace)

  if (places.length >= PLACES_CAP) {
    qs('[data-new-place]').classList.add('btn-new-place-disabled')
  }

  setPlaces(PLACES_STORAGE_KEY, places).then(getPlacesWeather).then(renderPlacesWeather)
  console.log('new places: ', places)
}

//when tabbing to btnNewPlace from places, hide btnDeletePlace
newGlobalEventListener('focusin', '#btnNewPlace', (e) => {
  if (e.relatedTarget == null) return
  if (e.relatedTarget.hasAttribute('data-place-card')) {
    qs('#btnDeletePlace', e.relatedTarget).hidden = true
  }
})

/**
 * delete place
 */

newGlobalEventListener('click', '#btnDeletePlace', (e) => {
  deletePlace(e.target.closest('[data-place-card]').dataset.id)
})

function deletePlace(cardId) {
  places = places.filter((place) => place.id !== cardId)

  if (places.length < PLACES_CAP) {
    qs('[data-new-place]').classList.remove('btn-new-place-disabled')
  }

  setPlaces(PLACES_STORAGE_KEY, places).then(getPlacesWeather).then(renderPlacesWeather)
}
