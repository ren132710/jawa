/* eslint-disable no-nested-ternary */
import { useCallback, useEffect } from 'react';
import PlaceCard from '@/components/places/PlaceCard';
import styles from '@/styles/places/PlacesContainer.module.css';
import {
  usePlacesWeatherData,
  usePlacesWeatherAPI,
} from '@/contexts/PlacesWeatherContext';
import {
  useMainWeatherData,
  useMainWeatherAPI,
} from '@/contexts/MainWeatherContext';
import { ERROR_MESSAGE_WEATHER } from '@/constants/constants';

export default function PlacesContainer() {
  console.log('PlacesContainer rendered!');
  const { places, placesWeatherData, isLoading, isError } =
    usePlacesWeatherData();
  const { setPlaces } = usePlacesWeatherAPI();
  const { setMainWeather } = useMainWeatherAPI();
  const { mainWeather } = useMainWeatherData();

  // set the main weather to the first place on startup, or whenever mainWeather is empty
  useEffect(() => {
    console.log('PlacesContainer useEffect called!');
    if (!placesWeatherData.length) return;
    if (mainWeather.length === 0) setMainWeather([placesWeatherData[0]]);
  }, [mainWeather.length, placesWeatherData, setMainWeather]);

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
      console.log('delete button clicked!');
      // prevent delete click event from triggering handleViewPlace
      e.stopPropagation();

      setPlaces(places.filter((place) => place.id !== e.target.dataset.id));
    },
    [places, setPlaces]
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

  // then return places
  return (
    <div className={styles.placesContainer} data-testid="places-container">
      {placesWeatherData.map((place) => (
        <PlaceCard
          key={place.coordinates.id}
          coordinates={place.coordinates}
          current={place.current}
          handleViewPlace={handleViewPlace}
          handleDeletePlace={handleDeletePlace}
          placesLength={places.length}
        />
      ))}
    </div>
  );
}
