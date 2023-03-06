import PropTypes from 'prop-types';
import styles from '@/styles/WeatherIcon.module.css';

export default function WeatherIcon({
  weatherIcon,
  weatherIconSize,
  weatherDescription,
  getIconUrl,
  customStyles,
  imgWidth,
  imgHeight,
  testId,
}) {
  return (
    <img
      className={
        weatherIconSize === 'large' ? styles.imgLarge : styles.imgSmall
      }
      src={getIconUrl(weatherIcon, { size: weatherIconSize })}
      width={imgWidth}
      height={imgHeight}
      alt={weatherDescription}
      style={customStyles}
      data-testid={testId}
      // optimize Largest Contentful Paint (LCP) by prioritizing large weather icon
      // eslint-disable-next-line react/no-unknown-property
      fetchpriority={weatherIconSize === 'large' ? 'high' : null}
    />
  );
}

WeatherIcon.defaultProps = {
  weatherIconSize: 'small',
  imgWidth: '50',
  imgHeight: '50',
  customStyles: {},
};

WeatherIcon.propTypes = {
  weatherIcon: PropTypes.string.isRequired,
  weatherIconSize: PropTypes.string,
  weatherDescription: PropTypes.string.isRequired,
  getIconUrl: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  customStyles: PropTypes.object,
  imgWidth: PropTypes.string,
  imgHeight: PropTypes.string,
  testId: PropTypes.string.isRequired,
};
