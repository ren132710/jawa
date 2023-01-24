import { useCallback } from 'react';
import PropTypes from 'prop-types';
import styles from '@/styles/places/PlaceDeleteButton.module.css';

export default function PlaceDeleteButton({
  onDelete,
  ariaLabel,
  imageAlt,
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

  // TODO:
  //  - use raw SVG

  return (
    <div
      role="button"
      id="btnDeletePlace"
      className={styles.btnPlaceDelete}
      // tabIndex="-1"
      tabIndex={0}
      onClick={onDelete}
      onKeyDown={onDelete}
      aria-label={ariaLabel}
      data-id={dataId}
      data-testid={testId}
      onMouseEnter={changeStyleOnMouseEnter}
      onMouseLeave={changeStyleOnMouseLeave}
      onFocus={changeStyleOnFocus}
    >
      {/* TODO: use raw SVG */}
      <img
        className={styles.btnImageDelete}
        src="https://d35aaqx5ub95lt.cloudfront.net/images/577b23547c1fc5bd95934c7d90f02f4d.svg"
        alt={imageAlt}
      />
    </div>
  );
}

PlaceDeleteButton.defaultProps = {
  ariaLabel: 'delete associated entity',
  imageAlt: 'an image representing the action to delete',
};

PlaceDeleteButton.propTypes = {
  onDelete: PropTypes.func.isRequired,
  ariaLabel: PropTypes.string,
  imageAlt: PropTypes.string,
  dataId: PropTypes.string.isRequired,
  testId: PropTypes.string.isRequired,
};
