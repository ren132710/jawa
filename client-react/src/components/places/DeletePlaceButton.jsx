import PropTypes from 'prop-types';
import styles from '@/styles/places/DeletePlaceButton.module.css';

// TODO: Delete button not working on ipad

function changeStyleOnPointerEnter(e) {
  if (document.body.dataset.theme === 'light') {
    e.target.style.boxShadow = '0 0 5px 0 var(--skyblue-85)';
  } else {
    e.target.style.boxShadow = '0 0 5px 0 var(--white)';
  }
}

function changeStyleOnPointerLeave(e) {
  e.target.style.boxShadow = 'none';
}

function changeStyleOnFocus(e) {
  // TODO: This function is not called when button is clicked
  // TODO: try setting style onPointerDown
  console.log('Delete Place Button changed style on focus called!');
  e.target.style.backgroundColor = 'var(--blue-10)';
  e.target.style.boxShadow = '0 0 8px 0 var(--blue-20)';
}

export default function DeletePlaceButton({ onDelete, placeId }) {
  console.log('PlaceDeleteButton rendered!');

  // mobile needs the onPointerDown event to see the delete button
  return (
    <div
      role="button"
      className={styles.placeBtnDelete}
      tabIndex={-1}
      // tabIndex={0}
      onPointerDown={onDelete}
      onKeyDown={onDelete}
      onPointerEnter={changeStyleOnPointerEnter}
      onPointerLeave={changeStyleOnPointerLeave}
      onFocus={changeStyleOnFocus}
      aria-label="tap to delete place from favorites"
      data-id={placeId}
      data-testid="btnDeletePlace"
    >
      <svg
        className={styles.svgX}
        viewBox="0 0 16 16"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M2 2l12 12M14 2L2 14" />
      </svg>
    </div>
  );
}

DeletePlaceButton.propTypes = {
  onDelete: PropTypes.func.isRequired,
  placeId: PropTypes.string.isRequired,
};
