import PropTypes from 'prop-types';

export default function WeatherIcon({
  weatherIcon,
  weatherDescription,
  getIconUrl,
}) {
  return (
    <img
      className="weatherIcon"
      src={getIconUrl(weatherIcon)}
      width="50"
      height="50"
      alt={weatherDescription}
      data-daily-icon
    />
  );
}

WeatherIcon.propTypes = {
  weatherIcon: PropTypes.string.isRequired,
  weatherDescription: PropTypes.string.isRequired,
  getIconUrl: PropTypes.func.isRequired,
};
