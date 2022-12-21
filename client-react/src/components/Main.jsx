import { useWeatherData } from '../contexts/WeatherContext';

export default function Main() {
  const { weatherData, isLoading, isError } = useWeatherData();

  // TODO: if isLoading=true, blur the page
  // TODO: decompose Main into Current, Daily, Hourly

  const weather = weatherData[0];

  return (
    <div>
      <h2>Current Weather</h2>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error!</p>}
      {weather && (
        <div>
          <p>Location: {weather.coordinates.location}</p>
          <p>Currently: {weather.current.description}</p>
          <p>Temp: {weather.current.temp}</p>
          <p>Feels like: {weather.current.feelsLike}</p>
          <p>High: {weather.current.high}</p>
          <p>Low: {weather.current.low}</p>
          <p>Humidity: {weather.current.humidity}</p>
          <p>Wind speed: {weather.current.windSpeed}</p>
          <p>Wind direction: {weather.current.windDirection}</p>
          <img
            src={`http://openweathermap.org/img/wn/${weather.current.icon}.png`}
            width="50"
            height="50"
            alt="clear sky"
            data-card-icon
          />
        </div>
      )}
    </div>
  );
}
