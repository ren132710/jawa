/*
TODO:
 refactor
 - extract menu into object?

 ui
 - style search box using google classes
 - search box variable height

 final clean
  - load performance
  - remove unused css, modularize css
  - remove console.logs
  - remove comments from CSS file
*/

import { Loader } from '@googlemaps/js-api-loader'
import { getWeather } from './getWeather.js'
import { getLocalStorage, setLocalStorage } from './localStorage.js'
import { newGlobalEventListener, qs } from './domUtils.js'
import * as df from './dateUtils.js'
import { getUoM } from './uom.js'
import { getTranslation } from './dictionary.js'
import { getIconUrl } from './parse.js'
import * as g from './globals.js'
const { v4 } = require('uuid')
const GOOGLE_API_KEY = process.env.API_KEY

/**
 * initialize page
 */

let places = []
let placesWeather = []
let prefs = []

getStorage(g.PREFS_STORAGE_KEY, g.DEFAULT_PREFS)
  .then((userPrefs) => {
    prefs = userPrefs
    console.log('prefs from localStorage ', userPrefs)
    setTheme(prefs[0].theme)
    setTranslations(prefs[0].lang)
  })
  .then(
    getStorage(g.PLACES_STORAGE_KEY, g.DEFAULT_PLACES).then((userPlaces) => {
      places = userPlaces
      console.log('places from localStorage ', userPlaces)
    })
  )
  .then(getPlacesWeather)
  .then(initialize)
  .catch((err) => {
    console.error('ERROR: ', err)
    alert(`There was a problem loading your places.`)
  })

function initialize() {
  console.log('placesWeather initialized: ', placesWeather)
  renderPlacesWeather()
  renderWeather(placesWeather[0])
}

async function getPlacesWeather() {
  let promises = []

  places.forEach((place) => {
    const params = {
      lat: place.lat,
      long: place.long,
      units: prefs[0].units,
      lang: prefs[0].lang,
      id: place.id,
      location: place.location,
    }
    const promise = getWeather(params)
    promises.push(promise)
  })

  await Promise.all(promises).then((data) => {
    placesWeather = data
  })
}

function setTranslations(lang) {
  qs('[data-place-search]').placeholder = getTranslation(1, lang)
  qs('[data-dictionary="Current"]').textContent = getTranslation(2, lang)
  qs('[data-dictionary="Forecast"]').textContent = getTranslation(3, lang)
  qs('[data-dictionary="Hourly"]').textContent = getTranslation(4, lang)
}

/**
 * header and preferences menu
 */

//highlight header when window scrolled
window.addEventListener('scroll', () => {
  const header = qs('.header-container')
  if (window.scrollY > 0) {
    header.classList.add('header-bg-active')
  } else {
    header.classList.remove('header-bg-active')
  }
})

//preferences menu toggle
const header = qs('.header-container')
const menuToggle = qs('.menu-toggle')
const menu = qs('#menu')
menuToggle.addEventListener('click', (e) => {
  header.classList.toggle('open')
})

//close the menu if the user clicks away
document.addEventListener('click', (e) => {
  if (!menu.contains(e.target) && !menuToggle.contains(e.target)) {
    header.classList.remove('open')
  }
})

//close the menu if the user tabs away
document.addEventListener('focusin', (e) => {
  if (!menu.contains(e.target) && !menuToggle.contains(e.target)) {
    header.classList.remove('open')
  }
})

//preferences menu
menu.addEventListener('click', (e) => {
  if (e.target == null || !e.target.matches('button')) return

  const action = e.target.dataset.action
  if (['metric', 'imperial'].includes(action)) switchUoM(action)
  if (['light', 'jawa', 'dark'].includes(action)) switchTheme(action)
  if (['en', 'fr', 'sv'].includes(action)) switchLang(action)
  return
})

function switchUoM(UoM) {
  prefs[0].units = UoM
  setStorage(g.PREFS_STORAGE_KEY, prefs)

  const params = {
    lat: qs('[data-current-lat]').dataset.currentLat,
    long: qs('[data-current-long]').dataset.currentLong,
    units: prefs[0].units,
    lang: prefs[0].lang,
    id: qs('[data-current-id]').dataset.currentId,
    location: qs('[data-current-location]').dataset.currentLocation,
  }

  const res = getWeather(params)
  res.then((data) => {
    renderWeather(data)
  })
  getPlacesWeather().then(renderPlacesWeather)
}

function switchLang(lang) {
  prefs[0].lang = lang
  setStorage(g.PREFS_STORAGE_KEY, prefs)
  setTranslations(prefs[0].lang)

  const params = {
    lat: qs('[data-current-lat]').dataset.currentLat,
    long: qs('[data-current-long]').dataset.currentLong,
    units: prefs[0].units,
    lang: prefs[0].lang,
    id: qs('[data-current-id]').dataset.currentId,
    location: qs('[data-current-location]').dataset.currentLocation,
  }

  const res = getWeather(params)
  res.then((data) => {
    renderWeather(data)
  })
  getPlacesWeather().then(renderPlacesWeather)
}

function switchTheme(theme) {
  prefs[0].theme = theme
  setStorage(g.PREFS_STORAGE_KEY, prefs)
  setTheme(theme)
}

function setTheme(theme) {
  qs('body').setAttribute('data-theme', theme)
}

/**
 * google autocomplete
 */

const loader = new Loader({
  apiKey: GOOGLE_API_KEY,
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

    const params = {
      lat: place.geometry.location.lat(),
      long: place.geometry.location.lng(),
      units: prefs[0].units,
      lang: prefs[0].lang,
      id: v4(),
      location: place.name,
    }

    const res = getWeather(params)
    res.then((data) => {
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

      //hide delete button when place card loses focus
      if (e.relatedTarget == null) return
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
  qs('[data-current-dt]').textContent = `${df.formatDayOfWeekShort(current.timestamp)} ${df.formatDayOfMonth(
    current.timestamp
  )} ${df.formatMonth(current.timestamp)} ${df.formatTime(current.timestamp)}`

  //top left quadrant
  qs('[data-current-id]').dataset.currentId = coordinates.id
  qs('[data-current-location]').dataset.currentLocation = coordinates.location
  qs('[data-current-location]').textContent = coordinates.location
  qs('[data-current-icon]').src = getIconUrl(current.icon, { size: 'large' })
  qs('[data-current-icon]').alt = current.description

  //top right quadrant
  qs('[data-current-lat]').dataset.currentLat = coordinates.lat
  qs('[data-current-long]').dataset.currentLong = coordinates.long
  qs('[data-current-lat]').textContent = coordinates.lat
  qs('[data-current-long]').textContent = coordinates.long
  qs('[data-current-high]').textContent = current.high
  qs('[data-current-low]').textContent = current.low
  qs('[data-current-temp]').textContent = current.temp
  qs('[data-temp-units]').dataset.tempUnits = ` ${getUoM(prefs[0].units, 'temp')}`
  qs('[data-current-fl]').textContent = current.feelsLike
  qs('[data-current-description]').textContent = current.description
  qs('[data-current-precip]').textContent = current.precip
  qs('[data-current-visibility').textContent = current.visibility
  qs('[data-visibility-units]').dataset.visibilityUnits = ` ${getUoM(prefs[0].units, 'distance')}`

  //bottom left quadrant
  qs('[data-current-uv-index]').textContent = current.uvIndex
  qs('[data-current-uv-level]').textContent = current.uvLevel
  qs('[data-current-humidity]').textContent = current.humidity
  qs('[data-current-wind-speed]').textContent = current.windSpeed
  qs('[data-wind-units]').dataset.windUnits = ` ${getUoM(prefs[0].units, 'velocity')} `
  qs('[data-current-wind-direction]').textContent = current.windDirection

  //bottom right quadrant
  qs('[data-current-dew-point]').textContent = current.dewPoint
  qs('[data-current-sunrise]').textContent = df.formatZonedTime(current.sunrise, coordinates.timezone)
  qs('[data-current-sunset]').textContent = df.formatZonedTime(current.sunset, coordinates.timezone)
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
    qs('[data-daily-date]', card).textContent = df.formatDayOfWeek(day.timestamp)
    qs('[data-daily-description]', card).textContent = day.description
    qs('[data-hl] > [data-daily-high]', card).textContent = day.high
    qs('[data-hl] > [data-daily-low]', card).textContent = day.low
    qs('[data-daily-humidity]', card).textContent = day.humidity
    qs('[data-daily-wind-speed]', card).textContent = day.windSpeed
    qs('[data-wind-units]', card).dataset.windUnits = ` ${getUoM(prefs[0].units, 'velocity')} `
    qs('[data-daily-wind-direction]', card).textContent = day.windDirection
    dailyContainer.append(card)
  })
}

//render hourly weather
const hourlyContainer = document.querySelector('.hourly-container')
const templateHourRow = document.querySelector('#template-hour-row')
function renderHourlyWeather(hourly, coordinates) {
  document.querySelector('[data-hour-timezone]').textContent = coordinates.timezone
  hourlyContainer.innerHTML = ''
  hourly
    //only the first 24 hours
    .slice(0, 24)
    //and every other hour
    .filter((h, i) => i % 2 === 1)
    .forEach((hour) => {
      const element = templateHourRow.content.cloneNode(true)
      const row = element.querySelector('.hour-row')
      qs('[data-hour-date]', row).textContent = df.formatDayOfWeek(hour.timestamp)
      qs('[data-hour]', row).textContent = df.formatZonedHour(hour.timestamp, coordinates.timezone)
      qs('[data-hour-icon]', row).src = getIconUrl(hour.icon)
      qs('[data-hour-icon]', row).alt = hour.description
      qs('[data-hour-temp]', row).textContent = hour.temp
      qs('[data-hour-precip]', row).textContent = hour.precip
      qs('[data-hour-wind-speed]', row).textContent = hour.windSpeed
      qs('[data-wind-units]', row).dataset.windUnits = ` ${getUoM(prefs[0].units, 'velocity')} `
      qs('[data-hour-wind-direction]', row).textContent = hour.windDirection
      qs('[data-hour-humidity]', row).textContent = hour.humidity
      qs('[data-hour-uv-level]', row).textContent = hour.uvLevel
      hourlyContainer.append(row)
    })
}

/**
 * localStorage (thenable)
 */

async function getStorage(key, value) {
  const isStorageEmpty = await getLocalStorage(key)
  if (isStorageEmpty == null || isStorageEmpty.length < 1) setStorage(key, value)
  const data = await getLocalStorage(key)
  return data
}

async function setStorage(key, value) {
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

  if (places.length >= g.PLACES_CAP) {
    qs('[data-new-place]').classList.add('btn-new-place-disabled')
  }

  setStorage(g.PLACES_STORAGE_KEY, places).then(getPlacesWeather).then(renderPlacesWeather)
  console.log('new places: ', places)
}

//hide delete place button when tabbing to new place button
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

  if (places.length < g.PLACES_CAP) {
    qs('[data-new-place]').classList.remove('btn-new-place-disabled')
  }

  setStorage(g.PLACES_STORAGE_KEY, places).then(getPlacesWeather).then(renderPlacesWeather)
}
