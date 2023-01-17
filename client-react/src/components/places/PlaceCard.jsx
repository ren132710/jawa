import PropTypes from 'prop-types';
import WeatherIcon from '../WeatherIcon';
import styles from '../../styles/places/PlaceCard.module.css';
import { useUtils } from '../../contexts/UtilsContext';

/**
 * TODO:
 *  - where should handleClick be defined?
 *  - implement handleClick -> update main weather data
 *  - onkeydown, execute only for enter key, key: "Enter", keyCode: 13
 *  - break out delete button into its own component
 *  - test/fix iOS double tap issue
 *  - test tabbing sequence
 */

export default function Place({ coordinates, current, handleClick }) {
  const { getIconUrl } = useUtils();
  console.log('Place rendered!');

  return (
    <div
      className={styles.placeCard}
      role="button"
      tabIndex={0}
      onClick={(e) => handleClick(e)}
      onKeyDown={(e) => handleClick(e)}
      aria-label="tap to view weather"
      data-id={coordinates.id}
      data-location={coordinates.location}
      data-lat={coordinates.lat}
      data-long={coordinates.long}
      data-test="place-card"
    >
      <button
        type="button"
        id="btnDeletePlace"
        className={styles.placeBtnDelete}
        tabIndex="-1"
        onClick={() => handleClick('delete place clicked')}
        hidden
      >
        {/* try &times; in lieu of '✕' ✕ */}✕
      </button>
      <WeatherIcon
        weatherIcon={current.icon}
        weatherIconSize="small"
        weatherDescription={current.description}
        getIconUrl={getIconUrl}
        testHandle="place-weather-icon"
        imgWidth="50"
        imgHeight="50"
      />
      <div
        className={[styles.placeText, styles.placeCardItem].join(' ')}
        data-test="place-location"
      >
        {coordinates.location}
      </div>
      <div
        className={[styles.placeText, styles.placeCardItem].join(' ')}
        data-test="place-hl"
      >
        <span data-test="place-high">{current.high}</span>/
        <span data-test="place-low">{current.low}°</span>
      </div>
    </div>
  );
}

Place.propTypes = {
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
  handleClick: PropTypes.func.isRequired,
};
