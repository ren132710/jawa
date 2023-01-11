import PropTypes from 'prop-types';

export default function WeatherIcon({
  weatherIcon,
  weatherDescription,
  getIconUrl,
  iconHandle,
}) {
  return (
    <img
      className="weatherIcon"
      src={getIconUrl(weatherIcon)}
      width="50"
      height="50"
      alt={weatherDescription}
      // add a handle for cypress testing
      data-weather-icon={iconHandle}
    />
  );
}

WeatherIcon.propTypes = {
  weatherIcon: PropTypes.string.isRequired,
  weatherDescription: PropTypes.string.isRequired,
  getIconUrl: PropTypes.func.isRequired,
  iconHandle: PropTypes.string.isRequired,
};
