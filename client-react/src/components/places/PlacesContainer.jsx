import { useCallback } from 'react';
import PlaceCard from '@/components/places/PlaceCard';
import styles from '@/styles/places/PlacesContainer.module.css';
import { useWeatherData, useWeatherAPI } from '@/contexts/WeatherContext';
import { ERROR_MESSAGE } from '@/constants/constants';

export default function PlacesContainer() {
  console.log('Places container rendered!');
  const { places, placesWeatherData, selectedWeatherId, isError } =
    useWeatherData();
  const { setSelectedWeatherId, setPlaces } = useWeatherAPI();

  const handleClick = useCallback(
    (e) => {
      setSelectedWeatherId({ id: e.target.dataset.id, belongsTo: 'places' });
    },
    [setSelectedWeatherId]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (!e.key === 'Enter') return;
      if (e.key === 'Enter') {
        setSelectedWeatherId({ id: e.target.dataset.id, belongsTo: 'places' });
      }
    },
    [setSelectedWeatherId]
  );

  // TODO: figure out delete rules:
  // user deletes all places??
  // user deletes current selectedWeatherId??
  const handleDelete = useCallback(
    (e) => {
      console.log('delete: ', e.target.dataset.id);
      if (
        selectedWeatherId != null &&
        selectedWeatherId === e.target.dataset.id
      ) {
        setSelectedWeatherId(undefined);
      }

      // if the deleted place is the first place in the array, select the second place
      // if (e.target.dataset.id === places[0].id) {
      //   setSelectedWeatherId({
      //     id: places[1].id,
      //     belongsTo: 'places',
      //   });
      // }
      setPlaces(places.filter((place) => place.id !== e.target.dataset.id));
    },
    [places, selectedWeatherId, setPlaces, setSelectedWeatherId]
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
          />
        ))
      )}
    </div>
  );
}
