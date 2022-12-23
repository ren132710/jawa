import PropTypes from 'prop-types';
import HourlyRow from './HourlyRow';
import styles from '../../styles/main/HourlyContainer.module.css';

export default function HourlyContainer({ hourly }) {
  console.log('Hourly container rendered!');

  return (
    <div className={styles.hourlyContainer}>
      <HourlyRow hourly={hourly} />
    </div>
  );
}

HourlyContainer.propTypes = {
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
      windDirection: PropTypes.number.isRequired,
      windSpeed: PropTypes.number.isRequired,
    })
  ).isRequired,
};
