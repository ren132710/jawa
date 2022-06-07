import { getIconUrl, parseIconUrl } from './helpers.js'

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
  ]

  it('should return a valid OpenWeather icon url given a valid iconKey', () => {
    iconKeys.forEach((key) => {
      expect(getIconUrl(key)).toBe(`http://openweathermap.org/img/wn/${key}.png`)
    })
  })

  it('should return undefined if icon key is invalid', () => {
    expect(getIconUrl('')).toBeUndefined
    expect(getIconUrl('02x')).toBeUndefined
    expect(getIconUrl('03y')).toBeUndefined
    expect(getIconUrl('04z')).toBeUndefined
  })

  it('when size is provided, should return a valid OpenWeather icon url per the specified size', () => {
    expect(getIconUrl(iconKeys[0], { size: '' })).toBe(`http://openweathermap.org/img/wn/${iconKeys[0]}.png`)
    expect(getIconUrl(iconKeys[1], { size: 'medium' })).toBe(`http://openweathermap.org/img/wn/${iconKeys[1]}@2x.png`)
    expect(getIconUrl(iconKeys[2], { size: 'large' })).toBe(`http://openweathermap.org/img/wn/${iconKeys[2]}@4x.png`)
  })
})

describe('#parseIconUrl', () => {
  const url_day = 'http://openweathermap.org/img/wn/01d.png'
  const url_night = 'http://openweathermap.org/img/wn/02n.png'
  const url_day_medium = 'http://openweathermap.org/img/wn/11d@2x.png'
  const url_night_large = 'http://openweathermap.org/img/wn/11n@4x.png'
  const url_invalid_key = 'http://openweathermap.org/img/wn/11q.png'

  it('should return valid OpenWeather icon ids from the url', () => {
    expect(parseIconUrl(url_day)).toBe('01d')
    expect(parseIconUrl(url_night)).toBe('02n')
    expect(parseIconUrl(url_day_medium)).toBe('11d')
    expect(parseIconUrl(url_night_large)).toBe('11n')
  })

  it('should return undefined if url is not valid', () => {
    expect(parseIconUrl('')).toBeUndefined
    expect(parseIconUrl(url_invalid_key)).toBeUndefined
  })
})
