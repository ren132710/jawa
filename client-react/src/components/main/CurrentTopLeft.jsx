import PropTypes from 'prop-types';
import NewPlaceButton from '@/components/places/NewPlaceButton';
import WeatherIcon from '@/components/WeatherIcon';
import styles from '@/styles/main/CurrentTopLeft.module.css';
import { useUtils } from '@/contexts/UtilsContext';

export default function CurrentTopLeft({
  id,
  location,
  lat,
  long,
  icon,
  description,
}) {
  console.log('CurrentTopLeft rendered!');
  const { getIconUrl } = useUtils();

  return (
    <div className={styles.currentTopLeft} data-testid="current-top-left">
      <div
        className={styles.currentLocation}
        data-current-id={id}
        data-current-location={location}
        data-current-lat={lat}
        data-current-long={long}
        data-testid="current-location"
      >
        {location}
      </div>
      <NewPlaceButton id={id} location={location} lat={lat} long={long} />
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
  id: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  lat: PropTypes.number.isRequired,
  long: PropTypes.number.isRequired,
  icon: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};
