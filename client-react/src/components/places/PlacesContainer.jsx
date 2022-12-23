import PlaceCard from './PlaceCard';
import { useWeatherData } from '../../contexts/WeatherContext';
import styles from '../../styles/places/PlacesContainer.module.css';
import { ERROR_MESSAGE } from '../../constants/constants';

// TODO: where should handleClick be defined?
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
