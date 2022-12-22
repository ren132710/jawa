import PropTypes from 'prop-types';
import styles from '../../styles/places/Place.module.css';

/**
 * TODO:
 *  - style degrees
 *  - where should handleClick be defined?
 *  - break out delete button into its own component
 *  - test/fix iOS double tap issue
 *  - test tabbing sequence
 */

export default function Place(props) {
  const { place, handleClick } = props;

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
      data-test="place-card"
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
        src={`http://openweathermap.org/img/wn/${place.current.icon}.png`}
        width="50"
        height="50"
        alt={`${place.current.description}`}
        data-test="place-card-icon"
      />
      <div
        className={[styles.placeText, styles.placeCardItem].join(' ')}
        data-test="place-card-location"
      >
        {place.coordinates.location}
      </div>
      <div
        className={[styles.placeText, styles.placeCardItem].join(' ')}
        data-test="place-card-hl"
      >
        <span data-test="place-card-high">{place.current.high}</span>/
        <span className="degrees" data-test="place-card-low">
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
