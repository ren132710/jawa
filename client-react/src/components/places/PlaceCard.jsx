/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import PlaceDeleteButton from '@/components/places/DeletePlaceButton';
import WeatherIcon from '@/components/WeatherIcon';
import styles from '@/styles/places/PlaceCard.module.css';
import { useUtils } from '@/contexts/UtilsContext';

export function PlaceCard({
  id,
  location,
  lat,
  long,
  weatherIcon,
  description,
  high,
  low,
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
      data-id={id}
      data-location={location}
      data-lat={lat}
      data-long={long}
      data-testid="place-card"
    >
      {/* unless there is only one place */}
      {/* reveal delete button when place is hovered or has focus  */}
      {placesLength === 1 ? null : isHovered ? (
        <PlaceDeleteButton onDelete={handleDeletePlace} placeId={id} />
      ) : null}
      <WeatherIcon
        weatherIcon={weatherIcon}
        weatherIconSize="small"
        weatherDescription={description}
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
        {location}
      </div>
      <div
        className={[styles.placeText, styles.placeCardItem].join(' ')}
        data-testid="place-hl"
      >
        <span data-testid="place-high">{high}</span>/
        <span data-testid="place-low">{low}°</span>
      </div>
    </div>
  );
}

export default PlaceCard;

PlaceCard.propTypes = {
  id: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  lat: PropTypes.number.isRequired,
  long: PropTypes.number.isRequired,
  weatherIcon: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  high: PropTypes.number.isRequired,
  low: PropTypes.number.isRequired,
  handleViewPlace: PropTypes.func.isRequired,
  handleDeletePlace: PropTypes.func.isRequired,
  placesLength: PropTypes.number.isRequired,
};

// memoization - keep for reference
// export const MemoizedPlaceCard = React.memo(
//   PlaceCard,
//   (prevProps, nextProps) => {
//     return (
//       prevProps.id === nextProps.id &&
//       prevProps.location === nextProps.location &&
//       prevProps.lat === nextProps.lat &&
//       prevProps.long === nextProps.long &&
//       prevProps.weatherIcon === nextProps.weatherIcon &&
//       prevProps.description === nextProps.description &&
//       prevProps.high === nextProps.high &&
//       prevProps.low === nextProps.low &&
//       prevProps.placesLength === nextProps.placesLength
//     );
//   }
// );
