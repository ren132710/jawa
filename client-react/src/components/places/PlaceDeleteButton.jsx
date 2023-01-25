import { useCallback } from 'react';
import PropTypes from 'prop-types';
import styles from '@/styles/places/PlaceDeleteButton.module.css';

export default function PlaceDeleteButton({
  onDelete,
  ariaLabel,
  dataId,
  testId,
}) {
  console.log('DeletePlaceButton rendered!');

  const changeStyleOnMouseEnter = useCallback((e) => {
    e.target.style.boxShadow = '0 0 5px 0 hsl(0, 0%, 100%)';
  }, []);

  const changeStyleOnMouseLeave = useCallback((e) => {
    e.target.style.boxShadow = 'none';
  }, []);

  const changeStyleOnFocus = useCallback((e) => {
    e.target.style.background = 'hsl(200, 100%, 20%)';
    e.target.style.boxShadow = '0 0 5px 0 hsl(0, 0%, 100%)';
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
      data-id={dataId}
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
  dataId: PropTypes.string.isRequired,
  testId: PropTypes.string.isRequired,
};
