import { useCallback } from 'react';
import PlaceCard from '@/components/places/PlaceCard';
import styles from '@/styles/places/PlacesContainer.module.css';
import { useHasError } from '@/contexts/HasErrorContext';
import {
  usePlacesWeatherData,
  usePlacesWeatherAPI,
} from '@/contexts/PlacesWeatherContext';
import { useMainWeatherAPI } from '@/contexts/MainWeatherContext';
import { ERROR_MESSAGE_WEATHER } from '@/constants/constants';

export default function PlacesContainer() {
  console.log('PlacesContainer rendered!');
  const { hasError } = useHasError();
  const { places, placesWeather } = usePlacesWeatherData();
  const { setPlaces, setPlacesWeather } = usePlacesWeatherAPI();
  const { setMainWeather } = useMainWeatherAPI();

  // memoize functions passed as props
  const handleViewPlace = useCallback(
    (e) => {
      // unless click or enter key, return
      if (!(e.type === 'click' || e.key === 'Enter')) return;

      // get the weather for the particular place
      const placeWeather = placesWeather.find(
        (place) => place.coordinates.id === e.target.dataset.id
      );

      // and pass it to the main weather context
      setMainWeather([placeWeather]);
    },
    [placesWeather, setMainWeather]
  );

  const handleDeletePlace = useCallback(
    (e) => {
      // prevent delete click event from triggering handleViewPlace
      e.stopPropagation();

      setPlaces(places.filter((place) => place.id !== e.target.dataset.id));
      setPlacesWeather(
        placesWeather.filter(
          (place) => place.coordinates.id !== e.target.dataset.id
        )
      );
    },
    [places, placesWeather, setPlaces, setPlacesWeather]
  );

  // if there was a getWeather error, return error UI
  if (hasError) {
    return (
      <div className="error-container">
        <div className="error">{ERROR_MESSAGE_WEATHER}</div>
      </div>
    );
  }

  console.log('PlacesContainer (placesWeather): ', placesWeather);

  // otherwise return places
  return (
    <div className={styles.placesContainer} data-testid="places-container">
      {placesWeather.map((place) => (
        <PlaceCard
          key={place.coordinates.id}
          id={place.coordinates.id}
          location={place.coordinates.location}
          lat={place.coordinates.lat}
          long={place.coordinates.long}
          weatherIcon={place.current.icon}
          description={place.current.description}
          high={place.current.high}
          low={place.current.low}
          handleViewPlace={handleViewPlace}
          handleDeletePlace={handleDeletePlace}
          placesLength={places.length}
        />
      ))}
    </div>
  );
}
