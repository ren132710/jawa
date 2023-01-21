import PropTypes from 'prop-types';

export default function WeatherIcon({
  weatherIcon,
  weatherIconSize,
  weatherDescription,
  getIconUrl,
  testId,
  imgWidth,
  imgHeight,
}) {
  return (
    <img
      className="weatherIcon"
      src={getIconUrl(weatherIcon, { size: weatherIconSize })}
      width={imgWidth}
      height={imgHeight}
      alt={weatherDescription}
      // add a handle for cypress testing
      data-testid={testId}
    />
  );
}

WeatherIcon.defaultProps = {
  weatherIconSize: 'small',
  imgWidth: '50',
  imgHeight: '50',
};

WeatherIcon.propTypes = {
  weatherIcon: PropTypes.string.isRequired,
  weatherIconSize: PropTypes.string,
  weatherDescription: PropTypes.string.isRequired,
  getIconUrl: PropTypes.func.isRequired,
  testId: PropTypes.string.isRequired,
  imgWidth: PropTypes.string,
  imgHeight: PropTypes.string,
};
