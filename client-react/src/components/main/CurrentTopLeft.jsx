import PropTypes from 'prop-types';
import WeatherIcon from '../WeatherIcon';
import styles from '../../styles/main/CurrentTopLeft.module.css';
import { useUtils } from '../../contexts/UtilsContext';

export default function CurrentTopLeft({ location, id, icon, description }) {
  console.log('CurrentTopLeft rendered!');
  const { getIconUrl } = useUtils();

  return (
    <div className={styles.currentTopLeft}>
      <div
        className={styles.currentLocation}
        data-current-location={location}
        data-current-id={id}
      >
        {location}
      </div>
      <WeatherIcon
        weatherIcon={icon}
        weatherIconSize="large"
        weatherDescription={description}
        getIconUrl={getIconUrl}
        testHandle="place"
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
