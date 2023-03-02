import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import styles from '@/styles/places/NewPlaceButton.module.css';
import { useUtils } from '@/contexts/UtilsContext';
import { usePrefsWeather } from '@/contexts/PrefsContext';
import { usePlacesWeatherAPI } from '@/contexts/PlacesWeatherContext';
import { useMainWeatherData } from '@/contexts/MainWeatherContext';

export default function NewPlaceButton({ id, location, lat, long }) {
  console.log('NewPlace rendered!');
  const { lang } = usePrefsWeather();
  const { setPlaces, setPlacesWeather } = usePlacesWeatherAPI();
  const { mainWeather } = useMainWeatherData();
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
    // then update places and placesWeather
    setPlaces((prevPlaces) => [...prevPlaces, newPlace]);
    setPlacesWeather((prevPlacesWeatherData) => [
      ...prevPlacesWeatherData,
      newMainWeather[0],
    ]);
  }

  return (
    <button
      type="button"
      id="btnNewPlace"
      className={styles.placeBtnNew}
      onClick={handleNewPlace}
      aria-label="click to add a new place"
      data-id={id}
      data-location={location}
      data-lat={lat}
      data-long={long}
      data-translation="5"
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
