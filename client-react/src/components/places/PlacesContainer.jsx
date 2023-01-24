import { useCallback } from 'react';
import PlaceCard from '@/components/places/PlaceCard';
import styles from '@/styles/places/PlacesContainer.module.css';
import { useWeatherData, useWeatherAPI } from '@/contexts/WeatherContext';
import { ERROR_MESSAGE } from '@/constants/constants';

export default function PlacesContainer() {
  console.log('Places container rendered!');
  const { places, placesWeatherData, selectedWeather, isError } =
    useWeatherData();
  const { setSelectedWeather, setPlaces } = useWeatherAPI();
  console.log('places: ', places);

  const handleClick = useCallback(
    (e) => {
      setSelectedWeather({ id: e.target.dataset.id, belongsTo: 'places' });
    },
    [setSelectedWeather]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (!e.key === 'Enter') return;
      if (e.key === 'Enter') {
        setSelectedWeather({ id: e.target.dataset.id, belongsTo: 'places' });
      }
    },
    [setSelectedWeather]
  );

  // Note: delete button is hidden when there is only one place
  const handleDelete = useCallback(
    (e) => {
      // prevent delete click event from triggering handleClick
      e.stopPropagation();

      // if selectedWeather is the deleted place, shift selectedWeather appropriately
      if (selectedWeather.id === e.target.dataset.id) {
        const index = places.findIndex(
          (place) => place.id === e.target.dataset.id
        );
        if (index === 0) {
          setSelectedWeather({
            id: places[1].id,
            belongsTo: 'places',
          });
        } else {
          setSelectedWeather({
            id: places[index - 1].id,
            belongsTo: 'places',
          });
        }
      }

      setPlaces(places.filter((place) => place.id !== e.target.dataset.id));
    },
    [places, selectedWeather.id, setPlaces, setSelectedWeather]
  );

  if (!placesWeatherData.length) return;

  return (
    <div className={styles.placesContainer} data-testid="places-container">
      {isError ? (
        <div className="error-container">
          <div className="error">{ERROR_MESSAGE}</div>
        </div>
      ) : (
        placesWeatherData.map((place) => (
          <PlaceCard
            key={place.coordinates.id}
            coordinates={place.coordinates}
            current={place.current}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            onDelete={handleDelete}
            placesLength={places.length}
          />
        ))
      )}
    </div>
  );
}
