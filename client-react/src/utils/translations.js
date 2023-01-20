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

export default function getTranslation(index, lang) {
  return TRANSLATIONS[index][lang];
}

/**
 * unit tests
 */

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe('#getTranslation', () => {
    it('should return the correct translation', () => {
      expect(getTranslation(1, 'en')).toBe('Weather at your places');
      expect(getTranslation(1, 'fr')).toBe('Météo à vos lieux');
      expect(getTranslation(1, 'sv')).toBe('Väder på dina platser');
      expect(getTranslation(2, 'en')).toBe('Current Weather');
      expect(getTranslation(2, 'fr')).toBe('Météo Actuelle');
      expect(getTranslation(2, 'sv')).toBe('Vädret Just Nu');
      expect(getTranslation(3, 'en')).toBe('Forecast');
      expect(getTranslation(3, 'fr')).toBe('Prévisions');
      expect(getTranslation(3, 'sv')).toBe('Prognos');
      expect(getTranslation(4, 'en')).toBe('Hourly Weather');
      expect(getTranslation(4, 'fr')).toBe('Prévisions Horaires');
      expect(getTranslation(4, 'sv')).toBe('Timmar');
      expect(getTranslation(5, 'en')).toBe('New Place');
      expect(getTranslation(5, 'fr')).toBe('Nouveau Lieu');
      expect(getTranslation(5, 'sv')).toBe('Ny Plats');
      expect(getTranslation(6, 'en')).toBe('Feels like');
      expect(getTranslation(6, 'fr')).toBe('Ressenti');
      expect(getTranslation(6, 'sv')).toBe('Känns som');
      expect(getTranslation(7, 'en')).toBe('Precip');
      expect(getTranslation(7, 'fr')).toBe('Précip');
      expect(getTranslation(7, 'sv')).toBe('Nederbörd');
      expect(getTranslation(8, 'en')).toBe('Visibility');
      expect(getTranslation(8, 'fr')).toBe('Visibilité');
      expect(getTranslation(8, 'sv')).toBe('Sikt');
      expect(getTranslation(9, 'en')).toBe('UV Index');
      expect(getTranslation(9, 'fr')).toBe('Indice UV');
      expect(getTranslation(9, 'sv')).toBe('UV-index');
      expect(getTranslation(10, 'en')).toBe('Humidity');
      expect(getTranslation(10, 'fr')).toBe('Humidité');
      expect(getTranslation(10, 'sv')).toBe('Luftfuktighet');
      expect(getTranslation(11, 'en')).toBe('Wind');
      expect(getTranslation(11, 'fr')).toBe('Vent');
      expect(getTranslation(11, 'sv')).toBe('Vind');
      expect(getTranslation(12, 'en')).toBe('Dew Point');
      expect(getTranslation(12, 'fr')).toBe('Point de rosée');
      expect(getTranslation(12, 'sv')).toBe('Daggpunkt');
      expect(getTranslation(13, 'en')).toBe('Sunrise');
      expect(getTranslation(13, 'fr')).toBe('Lever du soleil');
      expect(getTranslation(13, 'sv')).toBe('Soluppgång');
      expect(getTranslation(14, 'en')).toBe('Sunset');
      expect(getTranslation(14, 'fr')).toBe('Coucher du soleil');
      expect(getTranslation(14, 'sv')).toBe('Solnedgång');
    });
  });
}
