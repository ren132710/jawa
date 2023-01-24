/* eslint-disable no-nested-ternary */
import { useState } from 'react';
import PropTypes from 'prop-types';
import WeatherIcon from '@/components/WeatherIcon';
import PlaceDeleteButton from '@/components/places/PlaceDeleteButton';
import styles from '@/styles/places/PlaceCard.module.css';
import { useUtils } from '@/contexts/UtilsContext';

/**
 * TODO:
 *  - use DuoLingo delete icon and styling
 *  - figure out delete rules
 *  - break out delete button into its own component
 *  - show delete button on hover, hide on mouseout
 *  - test tabbing sequence
 */

export default function PlaceCard({
  coordinates,
  current,
  onClick,
  onKeyDown,
  onDelete,
  placesLength,
  // isPlaceDeleteButtonHidden,
}) {
  console.log('Place rendered!');
  const [isHovered, setIsHovered] = useState(false);
  const { getIconUrl } = useUtils();

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      className={styles.placeCard}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={onKeyDown}
      aria-label="tap to view weather"
      data-id={coordinates.id}
      data-location={coordinates.location}
      data-lat={coordinates.lat}
      data-long={coordinates.long}
      data-testid="place-card"
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      {/* {isPlaceDeleteButtonHidden ? null : isHovered ? ( */}
      {placesLength === 1 ? null : isHovered ? (
        <PlaceDeleteButton
          onDelete={onDelete}
          ariaLabel="delete place from favorites"
          dataId={coordinates.id}
          testId="place-delete-button"
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
  onClick: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  placesLength: PropTypes.number.isRequired,
  // isPlaceDeleteButtonHidden: PropTypes.bool.isRequired,
};
