import { useCallback } from 'react';
import PlaceCard from '@/components/places/PlaceCard';
import styles from '@/styles/places/PlacesContainer.module.css';
import { useWeatherData, useWeatherAPI } from '@/contexts/WeatherContext';
import { useSelectedWeather } from '@/contexts/SelectedWeatherContext';
import { ERROR_MESSAGE_WEATHER } from '@/constants/constants';

export default function PlacesContainer() {
  console.log('Places container rendered!');
  const { places, placesWeatherData, isLoading, isError } = useWeatherData();
  const { setPlaces } = useWeatherAPI();
  const { selectedWeather, setSelectedWeather } = useSelectedWeather();

  const handleViewPlaceWeather = useCallback(
    (e) => {
      // unless click or enter key, return
      if (!(e.type === 'click' || e.key === 'Enter')) return;
      setSelectedWeather({ id: e.target.dataset.id, search: false });
    },
    [setSelectedWeather]
  );

  // Note: delete button is hidden when there is only one place
  const handleDeletePlace = useCallback(
    (e) => {
      // prevent delete click event from triggering handleViewPlaceWeather
      e.stopPropagation();

      // if selectedWeather is the deleted place, shift selectedWeather appropriately
      if (selectedWeather.id === e.target.dataset.id) {
        const index = places.findIndex(
          (place) => place.id === e.target.dataset.id
        );
        if (index === 0) {
          setSelectedWeather({
            id: places[1].id,
            search: false,
          });
        } else {
          setSelectedWeather({
            id: places[index - 1].id,
            search: false,
          });
        }
      }

      setPlaces(places.filter((place) => place.id !== e.target.dataset.id));
    },
    [places, selectedWeather.id, setPlaces, setSelectedWeather]
  );

  // prevent rendering until weather data is loaded
  if (isLoading) return;
  if (!placesWeatherData.length) return;
  if (
    selectedWeather.search === false &&
    !placesWeatherData.find(
      (place) => place.coordinates.id === selectedWeather.id
    )
  )
    return;

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
            handleViewPlaceWeather={handleViewPlaceWeather}
            handleDeletePlace={handleDeletePlace}
            placesLength={places.length}
          />
        ))
      )}
    </div>
  );
}
