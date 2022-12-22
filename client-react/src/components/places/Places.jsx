/* eslint-disable jsx-a11y/click-events-have-key-events */
import Place from './Place';
import { useWeatherData } from '../../contexts/WeatherContext';
import styles from '../../styles/places/Places.module.css';

function handleClick(value) {
  console.log(value);
}

// TODO: where should handleClick be defined?

export default function Places() {
  const { weatherData, isError } = useWeatherData();

  console.log('Places container rendered!');

  return (
    <div className={styles.placesContainer}>
      {isError ? (
        <div className="error-container">
          <div className="error">
            That was weird. Something went wrong fetching your weather. Refresh
            the page and try again.
          </div>
        </div>
      ) : (
        weatherData.map((placeWeather) => (
          <Place
            key={placeWeather.coordinates.id}
            place={placeWeather}
            handleClick={handleClick}
          />
        ))
      )}
    </div>
  );
}
