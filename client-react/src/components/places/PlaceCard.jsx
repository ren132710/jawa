import PropTypes from 'prop-types';
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

export default function Place({ place, handleClick }) {
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
      data-id={place.coordinates.id}
      data-location={place.coordinates.location}
      data-lat={place.coordinates.lat}
      data-long={place.coordinates.long}
      data-place-card
    >
      <button
        type="button"
        id="btnDeletePlace"
        className={styles.placeBtnDelete}
        tabIndex="-1"
        onClick={() => handleClick('delete place clicked')}
        // hidden
      >
        {/* try &times; in lieu of '✕' ✕ */}✕
      </button>
      <img
        className={styles.placeCardItem}
        src={getIconUrl(place.current.icon)}
        width="50"
        height="50"
        alt={place.current.description}
        data-card-icon
      />
      <div
        className={[styles.placeText, styles.placeCardItem].join(' ')}
        data-card-location
      >
        {place.coordinates.location}
      </div>
      <div
        className={[styles.placeText, styles.placeCardItem].join(' ')}
        data-card-hl
      >
        <span data-card-high>{place.current.high}</span>/
        <span className="degrees" data-card-low>
          {place.current.low}
        </span>
      </div>
    </div>
  );
}

Place.propTypes = {
  place: PropTypes.shape({
    coordinates: PropTypes.shape({
      id: PropTypes.string,
      location: PropTypes.string,
      lat: PropTypes.number,
      long: PropTypes.number,
    }),
    current: PropTypes.shape({
      description: PropTypes.string,
      high: PropTypes.number,
      low: PropTypes.number,
      icon: PropTypes.string,
    }),
  }).isRequired,
  handleClick: PropTypes.func.isRequired,
};
