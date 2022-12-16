/* eslint-disable jsx-a11y/click-events-have-key-events */
import styles from '../../styles/places/Places.module.css';

function handleClick(value) {
  console.log(value);
}

export default function Places() {
  return (
    <div className={styles.placesContainer}>
      <div
        className={styles.placeCard}
        role="button"
        tabIndex={0}
        onClick={() => handleClick('place card clicked')}
        // onKeyDown={() => handleClick('place card keydown')}
        aria-label="tap to view weather"
        data-place-card
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
        <img
          className={styles.placeCardItem}
          src="http://openweathermap.org/img/wn/01d.png"
          width="50"
          height="50"
          alt="clear sky"
          data-card-icon
        />
        <div
          className={[styles.placeText, styles.placeCardItem].join(' ')}
          data-card-location
        >
          Portland
        </div>
        <div
          className={[styles.placeText, styles.placeCardItem].join(' ')}
          data-card-hl
        >
          <span data-card-high>42</span>/
          <span className={styles.degrees} data-card-low>
            32
          </span>
        </div>
      </div>
      <div
        className={styles.placeCard}
        role="button"
        tabIndex={0}
        onClick={() => handleClick('place card clicked')}
        // onKeyDown={() => handleClick('place card keydown')}
        aria-label="tap to view weather"
        data-place-card
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
        <img
          className={styles.placeCardItem}
          src="http://openweathermap.org/img/wn/13d.png"
          width="50"
          height="50"
          alt="snow"
          data-card-icon
        />
        <div
          className={[styles.placeText, styles.placeCardItem].join(' ')}
          data-card-location
        >
          Montreal
        </div>
        <div
          className={[styles.placeText, styles.placeCardItem].join(' ')}
          data-card-hl
        >
          <span data-card-high>34</span>/
          <span className={styles.degrees} data-card-low>
            32
          </span>
        </div>
      </div>
      <div
        className={styles.placeCard}
        role="button"
        tabIndex={0}
        onClick={() => handleClick('place card clicked')}
        // onKeyDown={() => handleClick('place card keydown')}
        aria-label="tap to view weather"
        data-place-card
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
        <img
          className={styles.placeCardItem}
          src="http://openweathermap.org/img/wn/02d.png"
          width="50"
          height="50"
          alt="few clouds"
          data-card-icon
        />
        <div
          className={[styles.placeText, styles.placeCardItem].join(' ')}
          data-card-location
        >
          San Francisco
        </div>
        <div
          className={[styles.placeText, styles.placeCardItem].join(' ')}
          data-card-hl
        >
          <span data-card-high>55</span>/
          <span className={styles.degrees} data-card-low>
            45
          </span>
        </div>
      </div>
      <div
        className={styles.placeCard}
        role="button"
        tabIndex={0}
        onClick={() => handleClick('place card clicked')}
        // onKeyDown={() => handleClick('place card keydown')}
        aria-label="tap to view weather"
        data-place-card
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
        <img
          className={styles.placeCardItem}
          src="http://openweathermap.org/img/wn/10d.png"
          width="50"
          height="50"
          alt="moderate rain"
          data-card-icon
        />
        <div
          className={[styles.placeText, styles.placeCardItem].join(' ')}
          data-card-location
        >
          Boston
        </div>
        <div
          className={[styles.placeText, styles.placeCardItem].join(' ')}
          data-card-hl
        >
          <span data-card-high>45</span>/
          <span className={styles.degrees} data-card-low>
            42
          </span>
        </div>
      </div>
    </div>
  );
}
