const Translations = {
  1: {
    en: 'Current Weather',
    fr: 'Météo Actuelle',
    sv: 'Vädret Just Nu',
  },
  2: { en: 'Feels like', fr: 'Ressenti', sv: 'Känns som' },
  3: { en: 'Humidity', fr: 'Humidité', sv: 'Luftfuktighet' },
  4: { en: 'Wind', fr: 'Vent', sv: 'Vind' },
  5: { en: 'Visibility', fr: 'Visibilité', sv: 'Sikt' },
};

export default function getTranslation(index, lang) {
  return Translations[index][lang];
}
