/*
TODO:

Initial Weather
-fetch weather for first place in Places array
-populate weather: update places not in focus
- do not repopulate weather when deleting or adding places
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

const LOCAL_STORAGE_PREFIX = 'JAWA'
const PLACES_STORAGE_KEY = `${LOCAL_STORAGE_PREFIX}-Places`

const DEFAULT_PLACES = [
  { id: addUniqueID(), location: 'boston', lat: 42.361145, long: -71.057083, high: 70, low: 60, icon: '02d' },
  {
    id: addUniqueID(),
    location: 'san francisco',
    lat: 37.733795,
    long: -122.446747,
    high: 71,
    low: 61,
    icon: '11d',
  },
  { id: addUniqueID(), location: 'montreal', lat: 45.508888, long: -73.561668, high: 72, low: 62, icon: '01d' },
  { id: addUniqueID(), location: 'new york', lat: 40.73061, long: -73.935242, high: 73, low: 63, icon: '03d' },
]

function addUniqueID() {
  return v4()
}

let places = getPlaces()

const placesContainer = document.querySelector('.places-container')
const templatePlaceCard = document.querySelector('#template-place-card')
function loadPlaces() {
  placesContainer.innerHTML = ''

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

//initialize page
function initialize() {
  loadPlaces()
  getWeather(places[0].lat, places[0].long, { scope: 'page' })
  //TODO: How to make repeated calls to api. Research axios with Promise.all
  places.forEach((place) => {
    getWeatherAsync(place.lat, place.long, { scope: 'places' })
  })
}

initialize()

/*
 * axios
 */

async function getWeatherAsync(lat, long, { scope = '' } = {}) {
  try {
    const res = await axios.get('http://localhost:3001/weather', { params: { lat, long }, timeout: 5000 })
    if (scope === 'page') {
      renderWeatherPage(res.data)
    } else if (scope === 'places') {
      renderWeatherPlaces(res.data)
    } else {
      renderWeatherPage(res.data)
    }
  } catch (e) {
    console.log(`ERROR: ${e}`)
    alert('Fetching weather encountered an issue. Please try again.')
  }
  return
}

function getWeather(lat, long, { scope = '' } = {}) {
  axios
    .get('http://localhost:3001/weather', { params: { lat, long }, timeout: 5000 })
    .then((res) => {
      if (scope === 'page') {
        renderWeatherPage(res.data)
      } else if (scope === 'places') {
        renderWeatherPlaces(res.data)
      } else {
        renderWeatherPage(res.data)
      }
    })
    .catch((e) => {
      console.error(e)
      alert('Fetching weather encountered an issue. Please try again.')
    })
  return
}

/*
 * render weather
 */

const card = document.querySelector('.place-card')
function renderWeatherPlaces({ coordinates, current }) {
  console.log('place: ', current, coordinates)
  card.querySelector('[data-location]').textContent = 'TODO'
  card.querySelector('[data-icon]').textContent = getIconUrl(current.icon)
  card.querySelector('[data-high]').textContent = current.high
  card.querySelector('[data-low]').textContent = current.low
}

function renderWeatherPage({ coordinates, current, daily, hourly }) {
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
  //TODO: LOCATION
  currentTopLeft.querySelector('[data-current-location').textContent = 'TODO: LOCATION'
  currentTopLeft.querySelector('[data-current-icon').src = getIconUrl(current.icon, { size: 'large' })

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

  currentBotLeft.querySelector('[data-current-uv-index]').textContent = current.uvIndex
  currentBotLeft.querySelector('[data-current-uv-level]').textContent = current.uvLevel
  currentBotLeft.querySelector('[data-current-humidity]').textContent = current.humidity
  currentBotLeft.querySelector('[data-current-wind-speed]').textContent = current.windSpeed
  currentBotLeft.querySelector('[data-current-wind-direction]').textContent = current.windDirection

  currentBotRight.querySelector('[data-current-dew-point').textContent = current.dewPoint
  //TODO: Adjust sunrise/sunset for DST
  currentBotRight.querySelector('[data-current-sunrise').textContent = formatTime(current.sunrise)
  currentBotRight.querySelector('[data-current-sunset').textContent = formatTime(current.sunset)
}

//render daily weather
const dailyContainer = document.querySelector('.daily-container')
const templateDailyCard = document.querySelector('#template-daily-card')
function renderDailyWeather(daily) {
  dailyContainer.innerHTML = ''
  daily.forEach((day) => {
    const element = templateDailyCard.content.cloneNode(true)
    const card = element.querySelector('.daily-card')
    card.querySelector('[data-icon]').src = getIconUrl(day.icon)
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
function renderHourlyWeather(hourly) {
  hourlyContainer.innerHTML = ''
  hourly
    .slice(0, 24)
    .filter((h, i) => i % 2 === 1)
    .forEach((hour) => {
      const element = templateHourRow.content.cloneNode(true)
      const row = element.querySelector('.hour-row')
      row.querySelector('[data-date]').textContent = formatDayOfWeek(hour.timestamp)
      row.querySelector('[data-hour]').textContent = formatHour(hour.timestamp)
      row.querySelector('[data-icon]').src = getIconUrl(hour.icon)
      row.querySelector('[data-hour-temp]').textContent = hour.temp
      row.querySelector('[data-hour-fl-temp]').textContent = hour.feelsLike
      row.querySelector('[data-hour-wind-speed]').textContent = hour.windSpeed
      row.querySelector('[data-hour-wind-direction]').textContent = hour.windDirection
      row.querySelector('[data-hour-humidity]').textContent = hour.humidity
      hourlyContainer.append(row)
    })
}

/*
 * helper functions
 */

function getPlaces() {
  localStorage.clear()
  if (localStorage.getItem(PLACES_STORAGE_KEY) == null) {
    setDefaultPlaces()
  }
  return JSON.parse(localStorage.getItem(PLACES_STORAGE_KEY))
}

function setDefaultPlaces() {
  localStorage.setItem(PLACES_STORAGE_KEY, JSON.stringify(DEFAULT_PLACES))
}

function savePlaces() {
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
    icon: parseIconUrl(currentTopLeft.querySelector('[data-current-icon').src),
  }

  places.push(newPlace)
  savePlaces()
}

function deletePlace(cardId) {
  places = places.filter((place) => place.id !== cardId)
  savePlaces()
}
