/*
TODO:

Initial Weather
-fetch weather for first place in Places array
-populate weather: current, daily, hourly, update remaining places

Places Search
 -fetch lon, lat, placeName from google api
 -fetch openWeather data
 -populate: current, daily, hourly
*/
import axios from 'axios'
import { format } from 'date-fns'
import { v4 } from 'uuid'

const LOCAL_STORAGE_PREFIX = 'JAWA'
const PLACES_STORAGE_KEY = `${LOCAL_STORAGE_PREFIX}-Places`

const DEFAULT_PLACES = [
  {
    id: addUniqueID(),
    location: 'san francisco',
    lat: 37.733795,
    long: -122.446747,
    high: 58,
    low: 48,
    iconKey: '11d',
  },
  { id: addUniqueID(), location: 'montreal', lat: 45.508888, long: -73.561668, high: 78, low: 68, iconKey: '01d' },
  { id: addUniqueID(), location: 'boston', lat: 42.361145, long: -71.057083, high: 79, low: 69, iconKey: '02d' },
  { id: addUniqueID(), location: 'new york', lat: 40.73061, long: -73.935242, high: 80, low: 70, iconKey: '03d' },
]

function addUniqueID() {
  return v4()
}

//handles
const currentTopLeft = document.querySelector('.current-top-left')
const currentTopRight = document.querySelector('.current-top-right')
const currentBotLeft = document.querySelector('.current-bottom-left')
const currentBotRight = document.querySelector('.current-bottom-right')
const templateDailyCard = document.querySelector('#template-daily-card')
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
    card.querySelector('[data-icon]').src = getIconUrl(place.iconKey)
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
      console.log(res.data)
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

//functions
function deletePlace(cardId) {
  let places = getPlacesFromLocalStorage()
  const filteredPlaces = places.filter((place) => place.id !== cardId)
  savePlacesToLocalStorage(filteredPlaces)
  loadPlaces()
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

function getPlacesFromLocalStorage() {
  // localStorage.clear()
  if (localStorage.getItem(PLACES_STORAGE_KEY) == null) {
    savePlacesToLocalStorage(DEFAULT_PLACES)
  }
  return JSON.parse(localStorage.getItem(PLACES_STORAGE_KEY))
}

function savePlacesToLocalStorage(places) {
  localStorage.setItem(PLACES_STORAGE_KEY, JSON.stringify(places))
}

//if 2nd param, default to false, otherwise default to empty
function getIconUrl(iconKey, { large = false } = {}) {
  const size = large ? '@4x' : ''
  return `http://openweathermap.org/img/wn/${iconKey}${size}.png`
}

function parseIconUrl(url) {
  return url
    .match(/\d\d\w@/)
    .toString()
    .slice(0, 3)
}
