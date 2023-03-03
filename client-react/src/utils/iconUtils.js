// see: https://openweathermap.org/weather-conditions#How-to-get-icon-URL

export default function getIconUrl(iconKey, { size = 'small' } = {}) {
  let sizeKey = '';

  if (size === 'small') sizeKey = '';
  if (size === 'large') sizeKey = '@4x';
  if (size === 'medium') sizeKey = '@2x';
  return `https://openweathermap.org/img/wn/${iconKey}${sizeKey}.png`;
}

/**
 * unit tests
 */

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe('#getIconUrl', () => {
    const iconKeys = [
      '01d',
      '02d',
      '03d',
      '04d',
      '09d',
      '10d',
      '11d',
      '50d',
      '01n',
      '02n',
      '03n',
      '04n',
      '09n',
      '10n',
      '11n',
      '50n',
    ];

    it('should return a valid OpenWeather icon url given a valid iconKey', () => {
      iconKeys.forEach((key) => {
        expect(getIconUrl(key)).toBe(
          `https://openweathermap.org/img/wn/${key}.png`
        );
      });
    });

    it('when size is provided, should return a valid OpenWeather icon url per the specified size', () => {
      expect(getIconUrl(iconKeys[0], { size: '' })).toBe(
        `https://openweathermap.org/img/wn/${iconKeys[0]}.png`
      );
      expect(getIconUrl(iconKeys[0], { size: 'small' })).toBe(
        `https://openweathermap.org/img/wn/${iconKeys[0]}.png`
      );
      expect(getIconUrl(iconKeys[1], { size: 'medium' })).toBe(
        `https://openweathermap.org/img/wn/${iconKeys[1]}@2x.png`
      );
      expect(getIconUrl(iconKeys[2], { size: 'large' })).toBe(
        `https://openweathermap.org/img/wn/${iconKeys[2]}@4x.png`
      );
    });
  });
}
