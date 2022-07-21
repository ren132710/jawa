const DICTIONARY = {
  1: { en: 'Weather at your places', fr: 'Météo à vos places', se: 'Väder på dina platser' },
  2: { en: 'Current Weather', fr: 'À Présent', se: 'Vädret Just Nu' },
  3: { en: 'Forecast', fr: 'Prévisions', se: 'Prognos' },
  4: { en: 'Hourly Weather', fr: 'Heure par Heure', se: 'Timmar' },
}

export function getTranslation(index, lang) {
  return DICTIONARY[index][lang]
}
