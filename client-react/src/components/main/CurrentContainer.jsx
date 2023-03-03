import { useEffect } from 'react';
import PropTypes from 'prop-types';
import CurrentTopLeft from '@/components/main/CurrentTopLeft';
import CurrentTopRight from '@/components/main/CurrentTopRight';
import CurrentBottomLeft from '@/components/main/CurrentBottomLeft';
import CurrentBottomRight from '@/components/main/CurrentBottomRight';
import styles from '@/styles/main/CurrentContainer.module.css';

export default function CurrentContainer({ coordinates, current }) {
  console.log('Current container rendered!');

  // on initial page load, remove the blur
  useEffect(() => {
    document.body.classList.remove('blur');
  }, []);

  return (
    <div className={styles.currentContainer} data-testid="current-container">
      <CurrentTopLeft
        id={coordinates.id}
        location={coordinates.location}
        lat={coordinates.lat}
        long={coordinates.long}
        icon={current.icon}
        description={current.description}
      />
      <CurrentTopRight
        lat={coordinates.lat}
        long={coordinates.long}
        high={current.high}
        low={current.low}
        temp={current.temp}
        feelsLike={current.feelsLike}
        description={current.description}
        precip={current.precip}
        visibility={current.visibility}
      />
      <CurrentBottomLeft
        uvIndex={current.uvIndex}
        uvLevel={current.uvLevel}
        humidity={current.humidity}
        windSpeed={current.windSpeed}
        windDirection={current.windDirection}
      />
      <CurrentBottomRight
        dewPoint={current.dewPoint}
        sunrise={current.sunrise}
        sunset={current.sunset}
        timezone={coordinates.timezone}
      />
    </div>
  );
}

CurrentContainer.propTypes = {
  coordinates: PropTypes.shape({
    id: PropTypes.string.isRequired,
    lang: PropTypes.string.isRequired,
    lat: PropTypes.number.isRequired,
    location: PropTypes.string.isRequired,
    long: PropTypes.number.isRequired,
    timezone: PropTypes.string.isRequired,
    timezone_offset: PropTypes.number.isRequired,
    units: PropTypes.string.isRequired,
  }).isRequired,
  current: PropTypes.shape({
    description: PropTypes.string.isRequired,
    dewPoint: PropTypes.number.isRequired,
    feelsLike: PropTypes.number.isRequired,
    high: PropTypes.number.isRequired,
    humidity: PropTypes.number.isRequired,
    icon: PropTypes.string.isRequired,
    low: PropTypes.number.isRequired,
    precip: PropTypes.number.isRequired,
    sunrise: PropTypes.number.isRequired,
    sunset: PropTypes.number.isRequired,
    temp: PropTypes.number.isRequired,
    timestamp: PropTypes.number.isRequired,
    uvIndex: PropTypes.number.isRequired,
    uvLevel: PropTypes.string.isRequired,
    visibility: PropTypes.number.isRequired,
    windDeg: PropTypes.number.isRequired,
    windDirection: PropTypes.string.isRequired,
    windSpeed: PropTypes.number.isRequired,
  }).isRequired,
};
