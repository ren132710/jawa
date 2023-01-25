import { useCallback } from 'react';
import PropTypes from 'prop-types';
import styles from '@/styles/places/PlaceDeleteButton.module.css';

export default function PlaceDeleteButton({
  onDelete,
  ariaLabel,
  placeId,
  testId,
}) {
  console.log('DeletePlaceButton rendered!');

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
      id="btnDeletePlace"
      className={styles.btnPlaceDelete}
      // tabIndex="-1"
      tabIndex={0}
      onClick={onDelete}
      onKeyDown={onDelete}
      onMouseEnter={changeStyleOnMouseEnter}
      onMouseLeave={changeStyleOnMouseLeave}
      onFocus={changeStyleOnFocus}
      aria-label={ariaLabel}
      data-id={placeId}
      data-testid={testId}
    >
      <svg
        className={styles.btnSvgDelete}
        viewBox="0 0 16 16"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M2 2l12 12M14 2L2 14" />
      </svg>
    </div>
  );
}

PlaceDeleteButton.defaultProps = {
  ariaLabel: 'delete associated entity',
};

PlaceDeleteButton.propTypes = {
  onDelete: PropTypes.func.isRequired,
  ariaLabel: PropTypes.string,
  placeId: PropTypes.string.isRequired,
  testId: PropTypes.string.isRequired,
};
