import { useWeatherData } from '../contexts/WeatherContext';

export default function Main() {
  const { weatherData, isLoading, isError } = useWeatherData();

  console.log('weatherData from Main', weatherData);
  console.log('isLoading from Main', isLoading);
  console.log('isError from Main', isError);

  // TODO: decompose Main into Current, Daily, Hourly

  return (
    <div>
      <h2>Current Weather</h2>
      {isError ? (
        <div style={{ padding: '.5rem', color: 'red' }}>
          Problem fetching weather...
        </div>
      ) : (
        <div>
          {isLoading ? (
            <div
              style={{
                padding: '.5rem',
              }}
            >
              Loading...
            </div>
          ) : (
            <>
              <p>Location: {weatherData[0]?.coordinates.location}</p>
              <p>Currently: {weatherData[0]?.current.description}</p>
              <p>Temp: {weatherData[0]?.current.temp}</p>
              <p>Wind Speed: {weatherData[0]?.current.windSpeed}</p>
              <p>Wind Direction: {weatherData[0]?.current.windDirection}</p>
              <img
                src={`http://openweathermap.org/img/wn/${weatherData[0]?.current.icon}.png`}
                width="50"
                height="50"
                alt="clear sky"
                data-card-icon
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
