/*
CitySearch
 -fetch lon, lat, cityName from google api
 -fetch openWeather data
 -populate window
*/

//fetch weather for first place and populate
//  current
//  daily
//  hourly
//fetch weather for remaining places
//create event listeners

// newPlace()
// deletePlace()
// renderPlaceWeather()
// citySearch()

import { v4 } from 'uuid'

const LOCAL_STORAGE_PREFIX = 'WAMP'
const PLACES_STORAGE_KEY = `${LOCAL_STORAGE_PREFIX}-Places`

const DEFAULT_PLACES = [
  { id: addUniqueID(), location: 'Montreal', lat: 45.508888, long: -73.561668, high: 78, low: 68, iconKey: '01d' },
  { id: addUniqueID(), location: 'Boston', lat: 42.361145, long: -71.057083, high: 79, low: 69, iconKey: '02d' },
  { id: addUniqueID(), location: 'New York', lat: 40.73061, long: -73.935242, high: 80, low: 70, iconKey: '03d' },
]

function addUniqueID() {
  return v4()
}

function getIconUrl(iconKey, { large = false } = {}) {
  const size = large ? '@4x' : ''
  return `http://openweathermap.org/img/wn/${iconKey}${size}.png`
}

const btnNewPlace = document.querySelector('#btnNewPlace')
const btnsDeletePlace = document.querySelectorAll('#btnDeletePlace')
const placeCards = document.querySelectorAll('.place-card')
const templateDailyCard = document.querySelector('#template-daily-card')
const templateHourRow = document.querySelector('#template-hour-row')

function renderPage() {
  console.log('Rendering page...')
  const savedPlaces = getPlacesFromLocalStorage()
  loadPlaces(savedPlaces)
  //TODO: fetch current weather
}

function getPlacesFromLocalStorage() {
  localStorage.clear() //TODO: Remove once I have page rendering done
  if (localStorage.getItem(PLACES_STORAGE_KEY) == null) {
    localStorage.setItem(PLACES_STORAGE_KEY, JSON.stringify(DEFAULT_PLACES))
  }

  return JSON.parse(localStorage.getItem(PLACES_STORAGE_KEY))
}

const placesContainer = document.querySelector('.places-container')
const templatePlaceCard = document.querySelector('#template-place-card')
function loadPlaces(places) {
  //TODO: fetch weather from openWeather
  placesContainer.innerHTML = ''
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
    placesContainer.append(element)
  })
}

btnNewPlace.addEventListener('click', (e) => {
  console.log(e.target)
})

placeCards.forEach((card) => {
  card.addEventListener('click', (e) => {
    if (e.target.id === 'btnDeletePlace') console.log(e.target.id)
    if (e.currentTarget === e.target) {
      console.log(e)
    } else {
      const parent = e.target.closest('.place-card')
      console.log(parent)
    }
  })
})

renderPage()
