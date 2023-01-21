import PropTypes from 'prop-types';
import WeatherIcon from '@/components/WeatherIcon';
import styles from '@/styles/main/CurrentTopLeft.module.css';
import { useUtils } from '@/contexts/UtilsContext';

export default function CurrentTopLeft({ location, id, icon, description }) {
  console.log('CurrentTopLeft rendered!');
  const { getIconUrl } = useUtils();

  return (
    <div className={styles.currentTopLeft} data-testid="current-top-left">
      <div
        className={styles.currentLocation}
        data-current-id={id}
        data-testid="current-location"
      >
        {location}
      </div>
      <WeatherIcon
        weatherIcon={icon}
        weatherIconSize="large"
        weatherDescription={description}
        getIconUrl={getIconUrl}
        testId="current-weather-icon"
        imgWidth="200"
        imgHeight="200"
      />
    </div>
  );
}

CurrentTopLeft.propTypes = {
  location: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};
