/* eslint-disable no-nested-ternary */
import { useState } from 'react';
import PropTypes from 'prop-types';
import PlaceDeleteButton from '@/components/places/DeletePlaceButton';
import WeatherIcon from '@/components/WeatherIcon';
import styles from '@/styles/places/PlaceCard.module.css';
import { useUtils } from '@/contexts/UtilsContext';

export default function PlaceCard({
  coordinates,
  current,
  handleViewPlace,
  handleDeletePlace,
  placesLength,
}) {
  console.log('PlaceCard rendered!');
  const [isHovered, setIsHovered] = useState(false);
  const { getIconUrl } = useUtils();

  return (
    <div
      className={styles.placeCard}
      role="button"
      tabIndex={0}
      onClick={handleViewPlace}
      onKeyDown={handleViewPlace}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      aria-label="tap to view weather"
      data-id={coordinates.id}
      data-location={coordinates.location}
      data-lat={coordinates.lat}
      data-long={coordinates.long}
      data-testid="place-card"
    >
      {/* do not reveal delete button when there is only one place */}
      {/* otherwise, reveal delete button when place is hovered or has focus */}
      {placesLength === 1 ? null : isHovered ? (
        <PlaceDeleteButton
          onDelete={handleDeletePlace}
          placeId={coordinates.id}
        />
      ) : null}
      <WeatherIcon
        weatherIcon={current.icon}
        weatherIconSize="small"
        weatherDescription={current.description}
        getIconUrl={getIconUrl}
        customStyles={{ pointerEvents: 'none' }}
        imgWidth="50"
        imgHeight="50"
        testId="place-weather-icon"
      />
      <div
        className={[styles.placeText, styles.placeCardItem].join(' ')}
        data-testid="place-location"
      >
        {coordinates.location}
      </div>
      <div
        className={[styles.placeText, styles.placeCardItem].join(' ')}
        data-testid="place-hl"
      >
        <span data-testid="place-high">{current.high}</span>/
        <span data-testid="place-low">{current.low}°</span>
      </div>
    </div>
  );
}

PlaceCard.propTypes = {
  coordinates: PropTypes.shape({
    id: PropTypes.string,
    location: PropTypes.string,
    lat: PropTypes.number,
    long: PropTypes.number,
  }).isRequired,
  current: PropTypes.shape({
    description: PropTypes.string,
    high: PropTypes.number,
    low: PropTypes.number,
    icon: PropTypes.string,
  }).isRequired,
  handleViewPlace: PropTypes.func.isRequired,
  handleDeletePlace: PropTypes.func.isRequired,
  placesLength: PropTypes.number.isRequired,
};
