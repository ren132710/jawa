import {qs, qsa} from './domUtils.js'

const DICTIONARY = {
  1: {en: 'Weather at your places', fr: 'Météo à vos lieux', sv: 'Väder på dina platser'},
  2: {en: 'Current Weather', fr: 'Météo Actuelle', sv: 'Vädret Just Nu'},
  3: {en: 'Forecast', fr: 'Prévisions', sv: 'Prognos'},
  4: {en: 'Hourly Weather', fr: 'Prévisions Horaires', sv: 'Timmar'},
  5: {en: 'New Place', fr: 'Nouveau Lieu', sv: 'Ny Plats'},
  6: {en: 'Feels like', fr: 'Ressenti', sv: 'Känns som'},
  7: {en: 'Precip', fr: 'Précip', sv: 'Nederbörd'},
  8: {en: 'Visibility', fr: 'Visibilité', sv: 'Sikt'},
  9: {en: 'UV Index', fr: 'Indice UV', sv: 'UV-index'},
  10: {en: 'Humidity', fr: 'Humidité', sv: 'Luftfuktighet'},
  11: {en: 'Wind', fr: 'Vent', sv: 'Vind'},
  12: {en: 'Dew Point', fr: 'Point de rosée', sv: 'Daggpunkt'},
  13: {en: 'Sunrise', fr: 'Lever du soleil', sv: 'Soluppgång'},
  14: {en: 'Sunset', fr: 'Coucher du soleil', sv: 'Solnedgång'},
}

function getTranslation(index, lang) {
  return DICTIONARY[index][lang]
}

export function setTranslations(lang) {
  // set language for search input placeholder
  qs('[data-place-search]').placeholder = getTranslation(1, lang)

  // set language for main page section titles
  qs('[data-dictionary="2"]').textContent = getTranslation(2, lang)
  qs('[data-dictionary="3"]').textContent = getTranslation(3, lang)
  qs('[data-dictionary="4"]').textContent = getTranslation(4, lang)

  // set language for current weather container
  qs('[data-dictionary="5"]').textContent = getTranslation(5, lang)
  qs('[data-dictionary="6"]').textContent = getTranslation(6, lang)
  qs('[data-dictionary="7"]').textContent = getTranslation(7, lang)
  qs('[data-dictionary="8"]').textContent = getTranslation(8, lang)
  qs('[data-dictionary="9"]').textContent = getTranslation(9, lang)
  qs('[data-dictionary="10"]').textContent = getTranslation(10, lang)
  qs('[data-dictionary="11"]').textContent = getTranslation(11, lang)
  qs('[data-dictionary="12"]').textContent = getTranslation(12, lang)
  qs('[data-dictionary="13"]').textContent = getTranslation(13, lang)
  qs('[data-dictionary="14"]').textContent = getTranslation(14, lang)

  //set language for daily container
  const dailyContainer = document.querySelector('[data-daily-container]')
  qsa('[data-dictionary="10"]', dailyContainer).forEach((label) => {
    label.textContent = getTranslation(10, lang)
  })
  qsa('[data-dictionary="11"]', dailyContainer).forEach((label) => {
    label.textContent = getTranslation(11, lang)
  })

  //set language for hourly container
  const hourlyContainer = document.querySelector('[data-hourly-container]')
  qsa('[data-dictionary="7"]', hourlyContainer).forEach((label) => {
    label.textContent = getTranslation(7, lang)
  })
  qsa('[data-dictionary="9"]', hourlyContainer).forEach((label) => {
    label.textContent = getTranslation(9, lang)
  })
  qsa('[data-dictionary="10"]', hourlyContainer).forEach((label) => {
    label.textContent = getTranslation(10, lang)
  })
  qsa('[data-dictionary="11"]', hourlyContainer).forEach((label) => {
    label.textContent = getTranslation(11, lang)
  })
}
