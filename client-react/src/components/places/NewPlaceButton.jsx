import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import styles from '@/styles/main/NewPlaceButton.module.css';
import {
  useMainWeatherData,
  useMainWeatherAPI,
} from '@/contexts/MainWeatherContext';
import { usePlacesWeatherAPI } from '@/contexts/PlacesWeatherContext';
import { useUtils } from '@/contexts/UtilsContext';
import { useWeatherPrefs } from '@/contexts/PrefsContext';

function changeStyleOnMouseEnter(e) {
  e.target.style.textDecoration = 'none';
  e.target.style.color = 'var(--blue-40)';
}

function changeStyleOnMouseLeave(e) {
  e.target.style.textDecoration = 'underline';
  e.target.style.color = 'var(--blue-30)';
}

export default function NewPlaceButton({ id, location, lat, long }) {
  console.log('NewPlace rendered!');
  const { setPlaces, setPlacesWeatherData } = usePlacesWeatherAPI();
  const { mainWeather } = useMainWeatherData();
  const { setMainWeather } = useMainWeatherAPI();
  const { lang } = useWeatherPrefs();
  const { getTranslation } = useUtils();

  function handleNewPlace(e) {
    const newId = uuidv4();

    const newPlace = {
      id: newId,
      location: e.target.dataset.location,
      lat: e.target.dataset.lat,
      long: e.target.dataset.long,
    };

    // deeply clone mainWeather to prevent reference related duplication bugs
    const newMainWeather = JSON.parse(JSON.stringify(mainWeather));
    // then set mainWeather with the new id
    newMainWeather[0].coordinates.id = newId;
    setMainWeather(newMainWeather);

    // then update places and placesWeatherData
    setPlaces((prevPlaces) => [...prevPlaces, newPlace]);
    setPlacesWeatherData((prevPlacesWeatherData) => [
      ...prevPlacesWeatherData,
      newMainWeather[0],
    ]);
  }

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
      data-id={id}
      data-location={location}
      data-lat={lat}
      data-long={long}
      data-testid="btnNewPlace"
    >
      {getTranslation(5, lang)}
    </button>
  );
}

NewPlaceButton.propTypes = {
  id: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  lat: PropTypes.number.isRequired,
  long: PropTypes.number.isRequired,
};
