import PropTypes from 'prop-types';
import styles from '@/styles/places/DeletePlaceButton.module.css';

export default function DeletePlaceButton({ onDelete, placeId }) {
  console.log('PlaceDeleteButton rendered!');

  // iOS needs the onPointerDown event to see the delete button
  return (
    <div
      role="button"
      className={styles.placeBtnDelete}
      tabIndex={-1}
      // tabIndex={0}
      onPointerDown={onDelete}
      onKeyDown={onDelete}
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
