import PropTypes from 'prop-types';
import DailyCard from './DailyCard';
import styles from '../../styles/main/DailyContainer.module.css';

export default function DailyContainer({ daily }) {
  console.log('Daily container rendered!');

  return (
    <div className={styles.dailyContainer}>
      <DailyCard daily={daily} />
    </div>
  );
}

DailyContainer.propTypes = {
  daily: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string.isRequired,
      high: PropTypes.number.isRequired,
      humidity: PropTypes.number.isRequired,
      icon: PropTypes.string.isRequired,
      low: PropTypes.number.isRequired,
      precip: PropTypes.number.isRequired,
      timestamp: PropTypes.number.isRequired,
      windDeg: PropTypes.number.isRequired,
      windDirection: PropTypes.number.isRequired,
      windSpeed: PropTypes.number.isRequired,
    })
  ).isRequired,
};
