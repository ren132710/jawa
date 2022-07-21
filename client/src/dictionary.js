const DICTIONARY = {
  1: { en: 'Weather at your places', fr: 'Météo à vos places', sv: 'Väder på dina platser' },
  2: { en: 'Current Weather', fr: 'Météo Actuelle', sv: 'Vädret Just Nu' },
  3: { en: 'Forecast', fr: 'Prévisions', sv: 'Prognos' },
  4: { en: 'Hourly Weather', fr: 'Heure par Heure', sv: 'Timmar' },
}

export function getTranslation(index, lang) {
  return DICTIONARY[index][lang]
}
