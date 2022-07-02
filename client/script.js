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
      - review Bancor/Ren, position: fixed
      - review MDN menu bar
 - prefs modal
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
import { addGlobalEventListener } from './domUtils.js'
const { v4 } = require('uuid')

const LOCAL_STORAGE_PREFIX = 'JAWA'
const PLACES_STORAGE_KEY = `${LOCAL_STORAGE_PREFIX}-Places`

const DEFAULT_PLACES = [
  // { id: '0498724f-63ce-4b17-81d3-9b3fbd4eb443', location: 'stockholm', lat: 59.3293, long: 18.0686 },
  // { id: '905e58e1-5510-4535-b4c8-2ed30045772d', location: 'austin', lat: 30.2672, long: -97.7431 },
  // { id: '6b819c6d-c8d4-4f2a-94c1-6eec48c6d8c8', location: 'montreal', lat: 45.5017, long: -73.5673 },
  { id: 'c9ae7c46-81e4-4c9d-a933-bb3c8d14fc87', location: 'new york', lat: 40.7128, long: -74.006 },
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
    console.error('ERROR: ', err)
    alert(`There was a problem loading your places.`)
  })

function initialize() {
  console.log('places initialized: ', places)
  console.log('placesWeather initialized: ', placesWeather)
  renderPlacesWeather()
  renderWeather(placesWeather[0])
  // initAutocomplete()
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

/*
 * axios
 * @param {string} lat: latitude, required by OpenWeather for weather data
 * @param {string} long: longitude, required by OpenWeather for weather data
 * @param {string} id:
 *   - id is used for adding/deleting places from localStorage
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

/*
 * google autocomplete
 */

const loader = new Loader({
  apiKey: process.env.API_KEY,
  libraries: ['places'],
})

const placeSearch = document.querySelector('[data-place-search]')
loader.load().then((google) => {
  const autocomplete = new google.maps.places.Autocomplete(placeSearch, {
    // types: ['(cities)'],
    types: ['geocode'],
    // componentRestrictions: { country: 'us' },
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
    card.querySelector('[data-card-location').innerText = place.coordinates.location
    card.querySelector('[data-card-icon]').src = getIconUrl(place.current.icon)
    card.querySelector('[data-card-icon]').alt = place.current.description
    card.querySelector('[data-card-hl] > [data-card-high]').innerText = place.current.high
    card.querySelector('[data-card-hl] > [data-card-low]').innerText = place.current.low
    //TODO: reverse tab - hide delete button
    //TODO: focusin: if e.relatedTarget is div, hide related button
    //TODO: tabbing back to search box hides delete button
    //TODO: refactor event listeners
    card.addEventListener('click', (e) => {
      if (e.target.id === 'btnDeletePlace') return

      let placeCard = e.target.closest('.place-card')
      if (!placeCard) return
      renderSavedPlaceWeather(placeCard.dataset.id)
    })

    card.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        let placeCard = e.target.closest('.place-card')
        if (!placeCard) return
        renderSavedPlaceWeather(placeCard.dataset.id)
      }
    })

    card.addEventListener('mouseenter', (e) => {
      let placeCard = e.target.closest('.place-card')
      if (!placeCard) return
      let btn = placeCard.querySelector('#btnDeletePlace')
      if (btn.hidden === true) btn.hidden = false
    })

    card.addEventListener('mouseleave', (e) => {
      let placeCard = e.target.closest('.place-card')
      if (!placeCard) return
      let btn = placeCard.querySelector('#btnDeletePlace')
      if (btn.hidden === false) btn.hidden = true
    })

    card.addEventListener('focusin', (e) => {
      console.log('1) focusin event: ', e)
      console.log('2) focusin event target: ', e.target)

      //show delete button on the new focus place card
      let placeCardNewFocus = e.target.closest('.place-card')
      if (!placeCardNewFocus) return
      let btn = placeCardNewFocus.querySelector('#btnDeletePlace')

      if (btn.hidden === true) btn.hidden = false

      console.log('3) focusin event relatedTarget: ', e.relatedTarget)
      if (e.relatedTarget.id === 'btnDeletePlace') e.relatedTarget.hidden = true

      //tabbing in reverse direction does not recognize the child delete button
      //so if tabbing skips to next place card, hide button from previous place card
      //TODO: focusin: if e.relatedTarget is div, hide related button
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
  currentTopLeft.querySelector('[data-current-location]').dataset.location = coordinates.location
  currentTopLeft.querySelector('[data-current-location]').textContent = coordinates.location
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

/*
 * new / delete place
 */

//newPlace
const btnNewPlace = document.querySelector('#btnNewPlace')
btnNewPlace.addEventListener('click', newPlace)
function newPlace() {
  const newPlace = {
    id: v4(),
    location: currentTopLeft.querySelector('[data-location]').innerText.toLowerCase(),
    lat: currentTopRight.querySelector('[data-current-lat]').innerText,
    long: currentTopRight.querySelector('[data-current-long]').innerText,
  }

  places.push(newPlace)

  //limit the number of saved places to 10
  if (places.length >= 10) {
    // document.querySelector('[data-new-place]').disabled = true
    document.querySelector('[data-new-place]').classList.add('btn-new-place-disabled')
  }
  setPlaces(PLACES_STORAGE_KEY, places).then(getPlacesWeather).then(renderPlacesWeather)
  console.log('new places: ', places)
}

btnNewPlace.addEventListener('focusin', (e) => {
  // console.log('1) focusin event: ', e)
  // console.log('2) focusin event target: ', e.target)
  // console.log('3) focusin event relatedTarget: ', e.relatedTarget)
  if (e.relatedTarget == null) return
  if (e.relatedTarget.id === 'btnDeletePlace') e.relatedTarget.hidden = true
})

//deletePlace
function deletePlace(cardId) {
  places = places.filter((place) => place.id !== cardId)

  if (places.length < 10) {
    // document.querySelector('[data-new-place]').disabled = false
    document.querySelector('[data-new-place]').classList.remove('btn-new-place-disabled')
  }

  setPlaces(PLACES_STORAGE_KEY, places).then(getPlacesWeather).then(renderPlacesWeather)
}

// function addGlobalEventListener(type, selector, callback) {
//   document.addEventListener(type, (e) => {
//     if (e.target.matches(selector)) callback(e)
//   })
// }

//wrapping listeners in function allows adding listeners dynamically
addGlobalEventListener('click', '#btnDeletePlace', (e) => {
  deletePlace(e.target.closest('[data-place-card]').dataset.id)
})
