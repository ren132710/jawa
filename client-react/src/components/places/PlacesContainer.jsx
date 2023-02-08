/* eslint-disable no-nested-ternary */
import { useCallback, useEffect } from 'react';
import PlaceCard from '@/components/places/PlaceCard';
import styles from '@/styles/places/PlacesContainer.module.css';
import { useWeatherData, useWeatherAPI } from '@/contexts/WeatherContext';
import {
  useMainWeatherData,
  useMainWeatherAPI,
} from '@/contexts/MainWeatherContext';
import { ERROR_MESSAGE_WEATHER } from '@/constants/constants';

export default function PlacesContainer() {
  console.log('PlacesContainer rendered!');
  const { places, placesWeatherData, isLoading, isError } = useWeatherData();
  const { setPlaces } = useWeatherAPI();
  const { setMainWeather } = useMainWeatherAPI();
  const { mainWeather } = useMainWeatherData();

  // on startup, set the main weather to the first place
  useEffect(() => {
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
      // prevent delete click event from triggering handleViewPlace
      e.stopPropagation();

      setPlaces(places.filter((place) => place.id !== e.target.dataset.id));
    },
    [places, setPlaces]
  );

  // wait until places weather is fully loaded
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

  return (
    <div className={styles.placesContainer} data-testid="places-container">
      {isError ? (
        <div className="error-container">
          <div className="error">{ERROR_MESSAGE_WEATHER}</div>
        </div>
      ) : (
        placesWeatherData.map((place) => (
          <PlaceCard
            key={place.coordinates.id}
            coordinates={place.coordinates}
            current={place.current}
            handleViewPlace={handleViewPlace}
            handleDeletePlace={handleDeletePlace}
            placesLength={places.length}
          />
        ))
      )}
    </div>
  );
}
