import { useCallback } from 'react';
import PlaceCard from '@/components/places/PlaceCard';
import styles from '@/styles/places/PlacesContainer.module.css';
import { useMainWeatherAPI } from '@/contexts/MainWeatherContext';
import {
  usePlacesWeatherData,
  usePlacesWeatherAPI,
} from '@/contexts/PlacesWeatherContext';
import { ERROR_MESSAGE_WEATHER } from '@/constants/constants';

export default function PlacesContainer() {
  console.log('PlacesContainer rendered!');
  const { places, placesWeatherData, isLoading, isError } =
    usePlacesWeatherData();
  const { setPlaces, setPlacesWeatherData } = usePlacesWeatherAPI();
  const { setMainWeather } = useMainWeatherAPI();

  // memoize functions passed as props
  const handleViewPlace = useCallback(
    (e) => {
      // unless click or enter key, return
      if (!(e.type === 'click' || e.key === 'Enter')) return;

      // get the weather for the particular place
      const placeWeather = placesWeatherData.find(
        (place) => place.coordinates.id === e.target.dataset.id
      );

      // and pass it to the main weather context
      setMainWeather([placeWeather]);
    },
    [placesWeatherData, setMainWeather]
  );

  const handleDeletePlace = useCallback(
    (e) => {
      // prevent delete click event from triggering handleViewPlace
      e.stopPropagation();

      setPlaces(places.filter((place) => place.id !== e.target.dataset.id));
      setPlacesWeatherData(
        placesWeatherData.filter(
          (place) => place.coordinates.id !== e.target.dataset.id
        )
      );
    },
    [places, placesWeatherData, setPlaces, setPlacesWeatherData]
  );

  // if error, return error message
  if (isError) {
    return (
      <div className={styles.placesContainer} data-testid="places-container">
        <div className="error-container">
          <div className="error">{ERROR_MESSAGE_WEATHER}</div>
        </div>
      </div>
    );
  }

  // otherwise, wait until places weather is fully loaded
  if (
    isLoading ||
    !placesWeatherData.length ||
    places.length !== placesWeatherData.length
  )
    return (
      <div className="loading-container">
        <div className="loading">Loading...</div>
      </div>
    );

  console.log('PlacesContainer (placesWeatherData): ', placesWeatherData);

  // then return places
  return (
    <div className={styles.placesContainer} data-testid="places-container">
      {placesWeatherData.map((place) => (
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
