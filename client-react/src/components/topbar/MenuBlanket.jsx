import React from 'react';
import PropTypes from 'prop-types';

export default function MenuBlanket({ onClose }) {
  console.log('MenuBlanket rendered!');
  const styles = {
    menuBlanket: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      /* background: 'rgb(0, 0, 0, 0.1)' */
      background: 'transparent',
      zIndex: 900,
    },
  };

  return (
    <div
      style={styles.menuBlanket}
      onClick={onClose}
      // close menu when user tabs away
      role="button"
      tabIndex={0}
      onKeyDown={onClose}
      aria-label="close menu"
      data-testid="menu-blanket"
    />
  );
}

MenuBlanket.propTypes = {
  onClose: PropTypes.func.isRequired,
};
