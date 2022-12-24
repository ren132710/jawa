import PlaceCard from './PlaceCard';
import styles from '../../styles/places/PlacesContainer.module.css';
import { useWeatherData } from '../../contexts/WeatherContext';
import { ERROR_MESSAGE } from '../../constants/constants';

/**
 * TODO: handleClick
 *  - set index of clicked place for Main.jsx
 */

function handleClick(value) {
  console.log(value);
}

export default function Places() {
  const { weatherData, isError } = useWeatherData();
  if (!weatherData.length) return;

  console.log('Places container rendered!');

  return (
    <div className={styles.placesContainer}>
      {isError ? (
        <div className="error-container">
          <div className="error">{ERROR_MESSAGE}</div>
        </div>
      ) : (
        weatherData.map((place) => (
          <PlaceCard
            key={place.coordinates.id}
            place={place}
            handleClick={handleClick}
          />
        ))
      )}
    </div>
  );
}
