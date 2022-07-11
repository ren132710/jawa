const { TEST_WEATHER } = require('../data/test-data-weather')
const { TEST_WIND_SPEED } = require('../data/test-data-wind-speed')
const { parseCurrentWeather, parseDailyWeather, parseHourlyWeather } = require('./server.js')

describe('#parseCurrentWeather', () => {
  const units = 'imperial'
  const testWeather = {
    current: parseCurrentWeather(TEST_WEATHER, units),
  }

  it('should correctly parse current weather', () => {
    expect(testWeather.current.timestamp).toBe(1654185994000)
    expect(testWeather.current.description).toBe('broken clouds')
    expect(testWeather.current.icon).toBe('04d')
    expect(testWeather.current.temp).toBe(53)
    expect(testWeather.current.high).toBe(53)
    expect(testWeather.current.low).toBe(49)
    expect(testWeather.current.feelsLike).toBe(53)
    expect(testWeather.current.visibility).toBe(6.2)
    expect(testWeather.current.precip).toBe(100)
    expect(testWeather.current.dewPoint).toBe(51)
    expect(testWeather.current.sunrise).toBe(1654134138000)
    expect(testWeather.current.sunset).toBe(1654199367000)
    expect(testWeather.current.uvIndex).toBe(0.46)
    expect(testWeather.current.uvLevel).toBe('low')
    expect(testWeather.current.humidity).toBe(93)
    expect(testWeather.current.windSpeed).toBe(9)
    expect(testWeather.current.windDirection).toBe('W')
    expect(testWeather.current.windDeg).toBe(260)
  })
})

describe('#parseDailyWeather', () => {
  const units = 'imperial'
  const testWeather = {
    daily: parseDailyWeather(TEST_WEATHER, units),
  }

  it('should correctly parse daily weather', () => {
    expect(testWeather.daily[4].timestamp).toBe(1654596000000)
    expect(testWeather.daily[4].description).toBe('clear sky')
    expect(testWeather.daily[4].icon).toBe('01d')
    expect(testWeather.daily[4].high).toBe(63)
    expect(testWeather.daily[4].low).toBe(46)
    expect(testWeather.daily[4].humidity).toBe(40)
    expect(testWeather.daily[4].windSpeed).toBe(9)
    expect(testWeather.daily[4].windDirection).toBe('E')
    expect(testWeather.daily[4].windDeg).toBe(107)

    //sample test remaining daily data
    expect(testWeather.daily[2].description).toBe('scattered clouds')
    expect(testWeather.daily[3].icon).toBe('04d')
    expect(testWeather.daily[5].high).toBe(64)
    expect(testWeather.daily[5].low).toBe(49)
    expect(testWeather.daily[6].humidity).toBe(40)
    expect(testWeather.daily[0].windSpeed).toBe(8)
    expect(testWeather.daily[0].windDirection).toBe('W')
    expect(testWeather.daily[0].windDeg).toBe(254)
  })
})

describe('#parseHourlyWeather', () => {
  const units = 'imperial'
  const testWeather = {
    hourly: parseHourlyWeather(TEST_WEATHER, units),
  }

  it('should correctly parse hourly weather', () => {
    expect(testWeather.hourly[5].timestamp).toBe(1654203600000)
    expect(testWeather.hourly[5].icon).toBe('04n')
    expect(testWeather.hourly[5].temp).toBe(50)
    expect(testWeather.hourly[5].precip).toBe(8)
    expect(testWeather.hourly[5].windSpeed).toBe(7)
    expect(testWeather.hourly[5].windDirection).toBe('SW')
    expect(testWeather.hourly[5].windDeg).toBe(246)
    expect(testWeather.hourly[5].humidity).toBe(94)
    expect(testWeather.hourly[5].uvLevel).toBe('low')

    //sample test remaining hourly data
    expect(testWeather.hourly[7].timestamp).toBe(1654210800000)
    expect(testWeather.hourly[9].icon).toBe('04n')
    expect(testWeather.hourly[9].description).toBe('overcast clouds')
    expect(testWeather.hourly[11].temp).toBe(47)
    expect(testWeather.hourly[13].precip).toBe(0)
    expect(testWeather.hourly[15].windSpeed).toBe(8)
    expect(testWeather.hourly[17].windDirection).toBe('W')
    expect(testWeather.hourly[19].windDeg).toBe(271)
    expect(testWeather.hourly[21].humidity).toBe(48)
    expect(testWeather.hourly[23].uvLevel).toBe('low')
  })
})

describe('#convert m/s to kph', () => {
  it('when units = metric, should correctly convert wind speed m/s to km/h', () => {
    let units = 'metric'
    const testWindSpeed = {
      current: parseCurrentWeather(TEST_WIND_SPEED, units),
      daily: parseDailyWeather(TEST_WIND_SPEED, units),
      hourly: parseHourlyWeather(TEST_WIND_SPEED, units),
    }

    //current:
    expect(testWindSpeed.current.windSpeed).toBe(4)
    //daily:
    expect(testWindSpeed.daily[0].windSpeed).toBe(4)
    expect(testWindSpeed.daily[1].windSpeed).toBe(7)
    expect(testWindSpeed.daily[2].windSpeed).toBe(11)
    //hourly
    expect(testWindSpeed.hourly[0].windSpeed).toBe(4)
    expect(testWindSpeed.hourly[1].windSpeed).toBe(7)
    expect(testWindSpeed.hourly[2].windSpeed).toBe(11)
    expect(testWindSpeed.hourly[3].windSpeed).toBe(14)
  })
})
