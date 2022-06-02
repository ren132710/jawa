const { parseCurrentWeather, parseDailyWeather, parseHourlyWeather } = require('./server.js')
const { TEST_STHLM } = require('./data/test-data-sthlm')

const sthlm = {
  current: parseCurrentWeather(TEST_STHLM),
  daily: parseDailyWeather(TEST_STHLM),
  hourly: parseHourlyWeather(TEST_STHLM),
}

describe('#parseCurrentWeather', () => {
  it('should correctly parse current weather', () => {
    expect(sthlm.current.timestamp).toBe(1654185994000)
    expect(sthlm.current.description).toBe('broken clouds')
    expect(sthlm.current.icon).toBe('04d')
    expect(sthlm.current.temp).toBe(53)
    expect(sthlm.current.high).toBe(53)
    expect(sthlm.current.low).toBe(49)
    expect(sthlm.current.feelsLike).toBe(53)
    expect(sthlm.current.visibility).toBe(6.2)
    expect(sthlm.current.precip).toBe(100)
    expect(sthlm.current.dewPoint).toBe(51)
    expect(sthlm.current.sunrise).toBe(1654134138000)
    expect(sthlm.current.sunset).toBe(1654199367000)
    expect(sthlm.current.uvIndex).toBe(0.46)
    expect(sthlm.current.uvLevel).toBe('low')
    expect(sthlm.current.humidity).toBe(93)
    expect(sthlm.current.windSpeed).toBe(9)
    expect(sthlm.current.windDirection).toBe('W')
    expect(sthlm.current.windDeg).toBe(260)
  })
})

describe('#parseDailyWeather', () => {
  it('should correctly parse daily weather', () => {
    expect(sthlm.daily[4].timestamp).toBe(1654596000000)
    expect(sthlm.daily[4].description).toBe('clear sky')
    expect(sthlm.daily[4].icon).toBe('01d')
    expect(sthlm.daily[4].high).toBe(63)
    expect(sthlm.daily[4].low).toBe(46)
    expect(sthlm.daily[4].humidity).toBe(40)
    expect(sthlm.daily[4].windSpeed).toBe(9)
    expect(sthlm.daily[4].windDirection).toBe('E')
    expect(sthlm.daily[4].windDeg).toBe(107)

    //sample test remaining daily data
    expect(sthlm.daily[2].description).toBe('scattered clouds')
    expect(sthlm.daily[3].icon).toBe('04d')
    expect(sthlm.daily[5].high).toBe(64)
    expect(sthlm.daily[5].low).toBe(49)
    expect(sthlm.daily[6].humidity).toBe(40)
    expect(sthlm.daily[0].windSpeed).toBe(8)
    expect(sthlm.daily[0].windDirection).toBe('W')
    expect(sthlm.daily[0].windDeg).toBe(254)
  })
})

describe('#parseHourlyWeather', () => {
  it('should correctly parse hourly weather', () => {
    expect(sthlm.hourly[5].timestamp).toBe(1654203600000)
    expect(sthlm.hourly[5].icon).toBe('04n')
    expect(sthlm.hourly[5].temp).toBe(50)
    expect(sthlm.hourly[5].precip).toBe(8)
    expect(sthlm.hourly[5].windSpeed).toBe(7)
    expect(sthlm.hourly[5].windDirection).toBe('SW')
    expect(sthlm.hourly[5].windDeg).toBe(246)
    expect(sthlm.hourly[5].humidity).toBe(94)
    expect(sthlm.hourly[5].uvLevel).toBe('low')

    //sample test remaining hourly data
    expect(sthlm.hourly[7].timestamp).toBe(1654210800000)
    expect(sthlm.hourly[9].icon).toBe('04n')
    expect(sthlm.hourly[11].temp).toBe(47)
    expect(sthlm.hourly[13].precip).toBe(0)
    expect(sthlm.hourly[15].windSpeed).toBe(8)
    expect(sthlm.hourly[17].windDirection).toBe('W')
    expect(sthlm.hourly[19].windDeg).toBe(271)
    expect(sthlm.hourly[21].humidity).toBe(48)
    expect(sthlm.hourly[23].uvLevel).toBe('low')
  })
})
