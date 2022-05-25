/*
TODO:

Initial Weather
-fetch weather for first place in Places array
-populate weather: current, daily, hourly, update remaining places
-populate weather when clicking on favorite place

Places Search
 -fetch lon, lat, placeName from google api
 -fetch openWeather data
 -populate: current, daily, hourly
*/
import axios from 'axios'
import { v4 } from 'uuid'
import {
  getIconUrl,
  parseIconUrl,
  formatMonth,
  formatDayOfMonth,
  formatDayOfWeek,
  formatDayOfWeekShort,
  formatHour,
  formatDate,
  formatTime,
} from './helpers.js'

const d = new Date()
console.log('Date(): ', d)

const LOCAL_STORAGE_PREFIX = 'JAWA'
const PLACES_STORAGE_KEY = `${LOCAL_STORAGE_PREFIX}-Places`

const DEFAULT_PLACES = [
  { id: addUniqueID(), location: 'boston', lat: 42.361145, long: -71.057083, high: 79, low: 69, icon: '02d' },
  {
    id: addUniqueID(),
    location: 'san francisco',
    lat: 37.733795,
    long: -122.446747,
    high: 58,
    low: 48,
    icon: '11d',
  },
  { id: addUniqueID(), location: 'montreal', lat: 45.508888, long: -73.561668, high: 78, low: 68, icon: '01d' },
  { id: addUniqueID(), location: 'new york', lat: 40.73061, long: -73.935242, high: 80, low: 70, icon: '03d' },
]

function addUniqueID() {
  return v4()
}

//handles

const templateHourRow = document.querySelector('#template-hour-row')

function renderPage() {
  loadPlaces()
}

const placesContainer = document.querySelector('.places-container')
const templatePlaceCard = document.querySelector('#template-place-card')
function loadPlaces() {
  placesContainer.innerHTML = ''

  const places = getPlacesFromLocalStorage()
  places.forEach((place) => {
    const element = templatePlaceCard.content.cloneNode(true)
    const card = element.querySelector('.place-card')
    card.dataset.id = place.id
    card.dataset.placeLocation = place.location
    card.dataset.placeLat = place.lat
    card.dataset.placeLong = place.long
    card.querySelector('[data-location').innerText = place.location
    card.querySelector('[data-icon]').src = getIconUrl(place.icon)
    card.querySelector('[data-hl] > [data-high]').innerText = place.high
    card.querySelector('[data-hl] > [data-low]').innerText = place.low
    card.addEventListener('click', (e) => {
      if (e.target.id === 'btnDeletePlace') return
      console.log(e.target)
    })
    placesContainer.append(element)
  })

  const initialPlace = places[0]
  getWeather(initialPlace.lat, initialPlace.long)
}

renderPage()

function getWeather(lat, long) {
  console.log(lat, long)
  axios
    .get('http://localhost:3001/weather', { params: { lat, long }, timeout: 5000 })
    .then((res) => {
      // console.log(res.data)
      renderWeather(res.data)
    })
    .catch((e) => {
      console.log(e)
      alert('An issue was encountered getting weather. Please try again.')
    })
}

//event listeners
function addGlobalEventListener(type, selector, callback) {
  document.addEventListener(type, (e) => {
    if (e.target.matches(selector)) callback(e)
  })
}

addGlobalEventListener('click', '#btnNewPlace', () => {
  newPlace()
})

addGlobalEventListener('click', '#btnDeletePlace', (e) => {
  deletePlace(e.target.closest('[data-place-card]').dataset.id)
})

/*
 * render weather
 */

function renderWeather({ coordinates, current, daily, hourly }) {
  renderCurrentWeather({ coordinates, current })
  renderDailyWeather(daily)
  renderHourlyWeather(hourly)
}

//render current weather
const currentTopLeft = document.querySelector('.current-top-left')
const currentTopRight = document.querySelector('.current-top-right')
const currentBotLeft = document.querySelector('.current-bottom-left')
const currentBotRight = document.querySelector('.current-bottom-right')
function renderCurrentWeather({ coordinates, current }) {
  console.log(coordinates)
  console.log(current)
  //top left
  //TODO: LOCATION
  currentTopLeft.querySelector('[data-current-location').textContent = 'TODO: LOCATION'
  currentTopLeft.querySelector('[data-current-icon').src = getIconUrl(current.icon, { size: 'large' })

  //top right
  currentTopRight.querySelector('[data-current-dt').textContent = `${formatDayOfWeekShort(
    current.timestamp
  )}, ${formatDayOfMonth(current.timestamp)} ${formatMonth(current.timestamp)} ${formatTime(current.timestamp)}`
  currentTopRight.querySelector('[data-current-lat').textContent = coordinates.lat
  currentTopRight.querySelector('[data-current-long').textContent = coordinates.long
  currentTopRight.querySelector('[data-current-high').textContent = current.high
  currentTopRight.querySelector('[data-current-low').textContent = current.low
  currentTopRight.querySelector('[data-current-temp').textContent = current.temp
  currentTopRight.querySelector('[data-current-fl').textContent = current.feelsLike
  currentTopRight.querySelector('[data-current-description').textContent = current.description
  currentTopRight.querySelector('[data-current-visibility').textContent = current.visibility

  //bottom left
  currentBotLeft.querySelector('[data-current-uv-index]').textContent = current.uvIndex
  currentBotLeft.querySelector('[data-current-uv-level]').textContent = current.uvLevel
  currentBotLeft.querySelector('[data-current-humidity]').textContent = current.humidity
  currentBotLeft.querySelector('[data-current-wind-speed]').textContent = current.windSpeed
  currentBotLeft.querySelector('[data-current-wind-direction]').textContent = current.windDirection

  //bottom right
  currentBotRight.querySelector('[data-current-dew-point').textContent = current.dewPoint
  //TODO: Adjust sunrise/sunset for DST
  currentBotRight.querySelector('[data-current-sunrise').textContent = formatTime(current.sunrise)
  currentBotRight.querySelector('[data-current-sunset').textContent = formatTime(current.sunset)
}

//render daily weather
const dailyContainer = document.querySelector('.daily-container')
const templateDailyCard = document.querySelector('#template-daily-card')
function renderDailyWeather(daily) {
  console.log(daily)
  dailyContainer.innerHTML = ''
  daily.forEach((day) => {
    const element = templateDailyCard.content.cloneNode(true)
    const card = element.querySelector('.daily-card')
    card.querySelector('[data-icon]').src = getIconUrl(day.icon)
    card.querySelector('[data-daily-date').innerText = formatDayOfWeek(day.timestamp)
    card.querySelector('[data-daily-description').textContent = day.description
    card.querySelector('[data-hl] > [data-daily-high]').textContent = day.high
    card.querySelector('[data-hl] > [data-daily-low]').textContent = day.low
    card.querySelector('[data-daily-humidity').textContent = day.humidity
    card.querySelector('[data-daily-wind-speed]').textContent = day.windSpeed
    card.querySelector('[data-daily-wind-direction]').textContent = day.windDirection
    dailyContainer.append(card)
  })
}

function renderHourlyWeather(hourly) {
  //TODO
  console.log(hourly)
}

//helper functions
function getPlacesFromLocalStorage() {
  localStorage.clear()
  if (localStorage.getItem(PLACES_STORAGE_KEY) == null) {
    savePlacesToLocalStorage(DEFAULT_PLACES)
  }
  return JSON.parse(localStorage.getItem(PLACES_STORAGE_KEY))
}

function savePlacesToLocalStorage(places) {
  localStorage.setItem(PLACES_STORAGE_KEY, JSON.stringify(places))
}

function newPlace() {
  const newPlace = {
    id: addUniqueID(),
    location: currentTopLeft.querySelector('[data-current-location').innerText.toLowerCase(),
    lat: currentTopRight.querySelector('[data-current-lat').innerText,
    long: currentTopRight.querySelector('[data-current-long').innerText,
    high: currentTopRight.querySelector('[data-current-high').innerText,
    low: currentTopRight.querySelector('[data-current-low').innerText,
    iconKey: parseIconUrl(currentTopLeft.querySelector('[data-current-icon').src),
  }

  let places = getPlacesFromLocalStorage()
  places.push(newPlace)
  savePlacesToLocalStorage(places)
  loadPlaces()
}

function deletePlace(cardId) {
  let places = getPlacesFromLocalStorage()
  const filteredPlaces = places.filter((place) => place.id !== cardId)
  savePlacesToLocalStorage(filteredPlaces)
  loadPlaces()
}
