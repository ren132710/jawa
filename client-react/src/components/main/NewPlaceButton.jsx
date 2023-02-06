import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import styles from '@/styles/main/NewPlaceButton.module.css';
import { useWeatherAPI } from '@/contexts/WeatherContext';
import { useUtils } from '@/contexts/UtilsContext';
import { usePrefsData } from '@/contexts/PrefsContext';

export default function NewPlaceButton({ location, lat, long }) {
  console.log('NewPlace rendered!');
  const { setPlaces } = useWeatherAPI();
  const { lang } = usePrefsData();
  const { getTranslation } = useUtils();

  const handleNewPlace = useCallback(
    (e) => {
      const newPlace = {
        id: uuidv4(),
        location: e.target.dataset.location,
        lat: e.target.dataset.lat,
        long: e.target.dataset.long,
      };
      setPlaces((prevPlaces) => [...prevPlaces, newPlace]);
    },
    [setPlaces]
  );

  const changeStyleOnMouseEnter = useCallback((e) => {
    e.target.style.textDecoration = 'none';
    e.target.style.color = 'var(--blue-40)';
  }, []);

  const changeStyleOnMouseLeave = useCallback((e) => {
    e.target.style.textDecoration = 'underline';
    e.target.style.color = 'var(--blue-30)';
  }, []);

  return (
    <button
      type="button"
      className={styles.placeBtnNew}
      onClick={handleNewPlace}
      onMouseEnter={changeStyleOnMouseEnter}
      onMouseLeave={changeStyleOnMouseLeave}
      onFocus={changeStyleOnMouseEnter}
      onBlur={changeStyleOnMouseLeave}
      aria-label="click to add a new place"
      data-location={location}
      data-lat={lat}
      data-long={long}
      data-testid="new-place-button"
    >
      {getTranslation(5, lang)}
    </button>
  );
}

NewPlaceButton.propTypes = {
  location: PropTypes.string.isRequired,
  lat: PropTypes.number.isRequired,
  long: PropTypes.number.isRequired,
};
