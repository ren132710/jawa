import PropTypes from 'prop-types';
import Current from './Current';
import styles from '../../styles/main/CurrentContainer.module.css';

export default function CurrentContainer({ coordinates, current }) {
  console.log('Current container rendered!');
  return (
    <div className={styles.currentContainer}>
      <Current coordinates={coordinates} current={current} />
    </div>
  );
}

CurrentContainer.propTypes = {
  coordinates: PropTypes.shape({
    id: PropTypes.string.isRequired,
    lang: PropTypes.string.isRequired,
    lat: PropTypes.number.isRequired,
    location: PropTypes.string.isRequired,
    long: PropTypes.number.isRequired,
    timezone: PropTypes.string.isRequired,
    timezone_offset: PropTypes.number.isRequired,
    units: PropTypes.string.isRequired,
  }).isRequired,
  current: PropTypes.shape({
    description: PropTypes.string.isRequired,
    dewPoint: PropTypes.number.isRequired,
    feelsLike: PropTypes.number.isRequired,
    high: PropTypes.number.isRequired,
    humidity: PropTypes.number.isRequired,
    icon: PropTypes.string.isRequired,
    low: PropTypes.number.isRequired,
    precip: PropTypes.number.isRequired,
    sunrise: PropTypes.number.isRequired,
    sunset: PropTypes.number.isRequired,
    temp: PropTypes.number.isRequired,
    timestamp: PropTypes.number.isRequired,
    uvIndex: PropTypes.number.isRequired,
    uvLevel: PropTypes.string.isRequired,
    visibility: PropTypes.number.isRequired,
    windDeg: PropTypes.number.isRequired,
    windDirection: PropTypes.string.isRequired,
    windSpeed: PropTypes.number.isRequired,
  }).isRequired,
};
