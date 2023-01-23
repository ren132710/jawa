import PlaceCard from '@/components/places/PlaceCard';
import styles from '@/styles/places/PlacesContainer.module.css';
import { useWeatherData } from '@/contexts/WeatherContext';
import { ERROR_MESSAGE } from '@/constants/constants';

/**
 * TODO: handleClick
 *  - set index of clicked place for Main.jsx to cascade weather data
 */

function handleClick(value) {
  console.log(value);
}

export default function PlacesContainer() {
  console.log('Places container rendered!');
  const { weatherData, isError } = useWeatherData();
  if (!weatherData.length) return;

  return (
    <div className={styles.placesContainer} data-testid="places-container">
      {isError ? (
        <div className="error-container">
          <div className="error">{ERROR_MESSAGE}</div>
        </div>
      ) : (
        weatherData.map((place) => (
          <PlaceCard
            key={place.coordinates.id}
            coordinates={place.coordinates}
            current={place.current}
            handleClick={handleClick}
          />
        ))
      )}
    </div>
  );
}
