import PropTypes from 'prop-types';
import HourlyRow from '@/components/main/HourlyRow';
import styles from '@/styles/main/HourlyContainer.module.css';

export default function HourlyContainer({ coordinates, hourly }) {
  console.log('Hourly container rendered!');
  if (!hourly.length) return;

  // starting with the next hour, only show every other hour
  const hourlyReduced = hourly.filter((hour, index) => index % 2 === 1);

  return (
    <div className={styles.hourlyContainer} data-testid="hourly-container">
      {hourlyReduced.map((hour) => (
        <HourlyRow
          key={hour.timestamp}
          timezone={coordinates.timezone}
          hour={hour}
        />
      ))}
    </div>
  );
}
HourlyContainer.propTypes = {
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
  hourly: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string.isRequired,
      humidity: PropTypes.number.isRequired,
      icon: PropTypes.string.isRequired,
      precip: PropTypes.number.isRequired,
      temp: PropTypes.number.isRequired,
      timestamp: PropTypes.number.isRequired,
      uvIndex: PropTypes.number.isRequired,
      uvLevel: PropTypes.string.isRequired,
      windDeg: PropTypes.number.isRequired,
      windDirection: PropTypes.string.isRequired,
      windSpeed: PropTypes.number.isRequired,
    })
  ).isRequired,
};
