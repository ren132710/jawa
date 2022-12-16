const TRANSLATIONS = {
  1: {
    en: 'Weather at your places',
    fr: 'Météo à vos lieux',
    sv: 'Väder på dina platser',
  },
  2: { en: 'Current Weather', fr: 'Météo Actuelle', sv: 'Vädret Just Nu' },
  3: { en: 'Forecast', fr: 'Prévisions', sv: 'Prognos' },
  4: { en: 'Hourly Weather', fr: 'Prévisions Horaires', sv: 'Timmar' },
  5: { en: 'New Place', fr: 'Nouveau Lieu', sv: 'Ny Plats' },
  6: { en: 'Feels like', fr: 'Ressenti', sv: 'Känns som' },
  7: { en: 'Precip', fr: 'Précip', sv: 'Nederbörd' },
  8: { en: 'Visibility', fr: 'Visibilité', sv: 'Sikt' },
  9: { en: 'UV Index', fr: 'Indice UV', sv: 'UV-index' },
  10: { en: 'Humidity', fr: 'Humidité', sv: 'Luftfuktighet' },
  11: { en: 'Wind', fr: 'Vent', sv: 'Vind' },
  12: { en: 'Dew Point', fr: 'Point de rosée', sv: 'Daggpunkt' },
  13: { en: 'Sunrise', fr: 'Lever du soleil', sv: 'Soluppgång' },
  14: { en: 'Sunset', fr: 'Coucher du soleil', sv: 'Solnedgång' },
};

function getTranslation(index, lang) {
  return TRANSLATIONS[index][lang];
}

console.log(getTranslation(1, 'en')); // Weather at your places
