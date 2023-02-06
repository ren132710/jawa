import { useCallback } from 'react';
import PropTypes from 'prop-types';
import styles from '@/styles/places/PlaceDeleteButton.module.css';

export default function PlaceDeleteButton({ onDelete, placeId }) {
  console.log('PlaceDeleteButton rendered!');

  const changeStyleOnMouseEnter = useCallback((e) => {
    e.target.style.boxShadow = '0 0 5px 0 var(--white)';
  }, []);

  const changeStyleOnMouseLeave = useCallback((e) => {
    e.target.style.boxShadow = 'none';
  }, []);

  const changeStyleOnFocus = useCallback((e) => {
    e.target.style.background = 'var(--blue-20)';
    e.target.style.boxShadow = '0 0 5px 0 var(--white)';
  }, []);

  return (
    <div
      role="button"
      className={styles.placeBtnDelete}
      tabIndex="-1"
      onClick={onDelete}
      onKeyDown={onDelete}
      onMouseEnter={changeStyleOnMouseEnter}
      onMouseLeave={changeStyleOnMouseLeave}
      onFocus={changeStyleOnFocus}
      aria-label="tap to delete place from favorites"
      data-id={placeId}
      data-testid="delete-place-button"
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

PlaceDeleteButton.propTypes = {
  onDelete: PropTypes.func.isRequired,
  placeId: PropTypes.string.isRequired,
};
