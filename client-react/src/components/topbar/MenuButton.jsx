import React from 'react';
import PropTypes from 'prop-types';
import styles from '@/styles/topbar/Button.module.css';

export function MenuButton({ title, onClick, ariaLabel, setting, testId }) {
  console.log('Button rendered!');

  return (
    <button
      type="button"
      className={styles.btn}
      onClick={onClick}
      aria-label={ariaLabel}
      data-setting={setting}
      data-testid={testId}
    >
      {title}
    </button>
  );
}

export const MemoizedMenuButton = React.memo(MenuButton);

MenuButton.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  ariaLabel: PropTypes.string.isRequired,
  setting: PropTypes.string.isRequired,
  testId: PropTypes.string.isRequired,
};
