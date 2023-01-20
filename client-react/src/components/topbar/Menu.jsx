import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '@/components/topbar/Button';
import styles from '@/styles/topbar/Menu.module.css';

/**
 * TODO:
 *  - change theme
 *  - change units
 *  - change language
 */

function handleClick(value) {
  console.log('clicked', value);
}
export default function Menu({ showMenu, delay, onClose }) {
  const [applyTransition, setApplyTransition] = useState(false);

  console.log('Menu rendered!');

  useEffect(() => {
    if (!showMenu) return;

    // pause before applying css transition
    const timeoutId = setTimeout(() => setApplyTransition(true), delay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [showMenu, delay]);

  return (
    <>
      <div
        className={`${styles.menu} ${
          showMenu && applyTransition ? 'visible' : ''
        }`}
        data-test="menu"
      >
        <div className={[styles.subMenu, styles.units].join(' ')}>
          <Button title="Metric" onClick={() => handleClick('Metric')} />
          <Button title="Imperial" onClick={() => handleClick('Imperial')} />
        </div>
        <div className={[styles.subMenu, styles.theme].join(' ')}>
          <Button title="Light" onClick={() => handleClick('Light')} />
          <Button title="Jawa" onClick={() => handleClick('Jawa')} />
          <Button title="Dark" onClick={() => handleClick('Dark')} />
        </div>
        <div className={[styles.subMenu, styles.lang].join(' ')}>
          <Button title="English" onClick={() => handleClick('en')} />
          <Button title="Français" onClick={() => handleClick('fr')} />
          <Button title="Svenska" onClick={() => handleClick('sv')} />
        </div>
      </div>
      {/* blanket placed below menu so menu is tabbable */}
      <div
        className={styles.menuBlanket}
        onClick={onClose}
        // close menu when user tabs away
        role="button"
        tabIndex={0}
        onKeyDown={onClose}
        aria-label="close menu"
        data-test="menu-blanket"
      />
    </>
  );
}

Menu.propTypes = {
  showMenu: PropTypes.bool.isRequired,
  delay: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};
