import PropTypes from 'prop-types';

export default function Main(props) {
  // TODO: if isLoading=true, blur the page
  console.log('props: ', props);

  const { isLoading, isError, weather } = props;

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

Main.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
  weather: PropTypes.shape({
    coordinates: PropTypes.shape({
      location: PropTypes.string.isRequired,
    }).isRequired,
    current: PropTypes.shape({
      description: PropTypes.string.isRequired,
      temp: PropTypes.number.isRequired,
      feelsLike: PropTypes.number.isRequired,
      high: PropTypes.number.isRequired,
      low: PropTypes.number.isRequired,
      humidity: PropTypes.number.isRequired,
      windSpeed: PropTypes.number.isRequired,
      windDirection: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
