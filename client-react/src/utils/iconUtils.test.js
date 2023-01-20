import { describe, it, expect } from 'vitest';
import getIconUrl from '@/utils/iconUtils';

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
        `http://openweathermap.org/img/wn/${key}.png`
      );
    });
  });

  it('when size is provided, should return a valid OpenWeather icon url per the specified size', () => {
    expect(getIconUrl(iconKeys[0], { size: '' })).toBe(
      `http://openweathermap.org/img/wn/${iconKeys[0]}.png`
    );
    expect(getIconUrl(iconKeys[0], { size: 'small' })).toBe(
      `http://openweathermap.org/img/wn/${iconKeys[0]}.png`
    );
    expect(getIconUrl(iconKeys[1], { size: 'medium' })).toBe(
      `http://openweathermap.org/img/wn/${iconKeys[1]}@2x.png`
    );
    expect(getIconUrl(iconKeys[2], { size: 'large' })).toBe(
      `http://openweathermap.org/img/wn/${iconKeys[2]}@4x.png`
    );
  });
});
