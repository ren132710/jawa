/*
TODO:
City/Places Search
 -fetch lon, lat, placeName from google api
 -fetch openWeather data
 -populate: current, daily, hourly

 prefs
 - open preferences drawer on right side of screen
 - themes: default, sunrise, desert, winter
 - night mode
 - Future: Units

 misc
 - convert to DST (server side)
 - add place.id to placesWeather?

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

//TODO: Is it necessary to store high, low, icon?
const DEFAULT_PLACES = [
  // { id: addUniqueID(), location: 'boston', lat: 42.361145, long: -71.057083, high: 70, low: 60, icon: '02d' },
  // {
  //   id: addUniqueID(),
  //   location: 'san francisco',
  //   lat: 37.733795,
  //   long: -122.446747,
  //   high: 71,
  //   low: 61,
  //   icon: '11d',
  // },
  { id: addUniqueID(), location: 'montreal', lat: 45.508888, long: -73.561668, high: 72, low: 62, icon: '01d' },
  { id: addUniqueID(), location: 'new york', lat: 40.73061, long: -73.935242, high: 73, low: 63, icon: '03d' },
]

function addUniqueID() {
  return v4()
}

/*
 * initialize page
 */

let places = getPlaces()
console.log('places: ', places)
let placesWeather = []

getPlacesWeather().then(initialize)

function initialize() {
  console.log('initialized: ', placesWeather)
  renderPlacesWeather()
  renderPageWeather(placesWeather[0], { location: places[0].location })
}

async function getPlacesWeather() {
  let promises = []

  places.forEach((place) => {
    const promise = fetchAxiosPromise(place.lat, place.long)
    promises.push(promise)
  })

  //TODO: use Promise.allSettled??
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
  deletePlace(e.target.closest('[data-place-card]').dataset.id)
})

/*
 * axios
 */

async function fetchAxiosPromise(lat, long) {
  try {
    const res = await axios.get('http://localhost:3001/weather', { params: { lat, long }, timeout: 5000 })
    return res.data
  } catch (e) {
    console.log(`ERROR: ${e}`)
    alert('Fetching weather encountered an issue. Please try again.')
  }
}

async function getWeather(lat, long, { target = '' } = {}) {
  try {
    const res = await axios.get('http://localhost:3001/weather', { params: { lat, long }, timeout: 5000 })
    if (target === 'page') {
      renderPageWeather(res.data)
    } else if (target === 'places') {
      renderPlacesWeather(res.data)
    } else {
      renderPageWeather(res.data)
    }
  } catch (e) {
    console.log(`ERROR: ${e}`)
    alert('Fetching weather encountered an issue. Please try again.')
  }
}

/*
 * render weather
 */

const placesContainer = document.querySelector('.places-container')
const templatePlaceCard = document.querySelector('#template-place-card')
function renderPlacesWeather() {
  placesContainer.innerHTML = ''

  places.forEach((place, i) => {
    const element = templatePlaceCard.content.cloneNode(true)
    const card = element.querySelector('.place-card')
    card.dataset.placeId = place.id
    //TODO: fetch location based on lat & long, reverse geocoding
    card.dataset.placeLocation = place.location
    card.dataset.placeLat = placesWeather[i].coordinates.lat
    card.dataset.placeLong = placesWeather[i].coordinates.long
    card.dataset.placeHigh = placesWeather[i].current.high
    card.dataset.placeLow = placesWeather[i].current.low
    card.dataset.icon = getIconUrl(placesWeather[i].current.icon)
    card.querySelector('[data-location').innerText = place.location
    card.querySelector('[data-icon]').src = getIconUrl(placesWeather[i].current.icon)
    card.querySelector('[data-hl] > [data-high]').innerText = placesWeather[i].current.high
    card.querySelector('[data-hl] > [data-low]').innerText = placesWeather[i].current.low
    card.addEventListener('click', (e) => {
      if (e.target.id === 'btnDeletePlace') return
      renderWeather(e.target.dataset.placeId, e.target.dataset.placeLocation)
    })
    placesContainer.append(element)
  })
}

function renderWeather(id, location) {
  const index = places.findIndex((place) => {
    return place.id === id
  })
  renderPageWeather(placesWeather[index], { location: location })
}

function renderPageWeather({ coordinates, current, daily, hourly }, { location = '' } = {}) {
  console.log('location from renderPageWeather:', location)
  document.body.classList.remove('blurred')
  renderCurrentWeather({ coordinates, current }, { location: location })
  renderDailyWeather(daily)
  renderHourlyWeather(hourly)
}

//render current weather
const currentTopLeft = document.querySelector('.current-top-left')
const currentTopRight = document.querySelector('.current-top-right')
const currentBotLeft = document.querySelector('.current-bottom-left')
const currentBotRight = document.querySelector('.current-bottom-right')
function renderCurrentWeather({ coordinates, current }, { location = '' } = {}) {
  currentTopLeft.querySelector('[data-current-location').textContent = location
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
    //get every other hour
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
      row.querySelector('[data-hour-uv-level]').textContent = hour.uvLevel
      hourlyContainer.append(row)
    })
}

/*
 * helper functions
 */

//TODO: Try wrapping localStorage.get/localStorage.set in  promises

function getPlaces() {
  localStorage.clear()
  if (localStorage.getItem(PLACES_STORAGE_KEY) == null) {
    setDefaultPlaces()
  }
  /*
    Try
    If the value after await operator is not a Promise, converts the value to a resolved Promise, and waits for it. 
    const result = await localStorage.getItem(PLACES_STORAGE_KEY)
    return JSON.parse(result)
    
  */
  return JSON.parse(localStorage.getItem(PLACES_STORAGE_KEY))
}

function setDefaultPlaces() {
  localStorage.setItem(PLACES_STORAGE_KEY, JSON.stringify(DEFAULT_PLACES))
}

//Test again without async await, localStorage is synchronous so not sure why this works
//Otherwise, make it asynchronous by hacking delay with an additional code step,
// if (localStorage.getItem(PLACES_STORAGE_KEY) != null) return true
//TODO: Delete not working, possibly related to async/await code
async function savePlaces() {
  await localStorage.setItem(PLACES_STORAGE_KEY, JSON.stringify(places))
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
  savePlaces().then(getPlacesWeather).then(renderPlacesWeather)
}

function deletePlace(cardId) {
  places = places.filter((place) => place.id !== cardId)
  savePlaces().then(getPlacesWeather).then(renderPlacesWeather)
}
