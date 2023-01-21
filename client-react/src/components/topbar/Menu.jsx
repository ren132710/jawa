import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import MenuButton from '@/components/topbar/MenuButton';
import MenuBlanket from '@/components/topbar/MenuBlanket';
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
        data-testid="menu"
      >
        <div className={[styles.subMenu, styles.units].join(' ')}>
          <MenuButton
            title="Metric"
            onClick={() => handleClick('Metric')}
            ariaLabel="switch to metric"
            testId="btnMetric"
          />
          <MenuButton
            title="Imperial"
            onClick={() => handleClick('Imperial')}
            ariaLabel="switch to imperial"
            testId="btnImperial"
          />
        </div>
        <div className={[styles.subMenu, styles.theme].join(' ')}>
          <MenuButton
            title="Light"
            onClick={() => handleClick('Light')}
            ariaLabel="switch to light mode"
            testId="btnLightMode"
          />
          <MenuButton
            title="Jawa"
            onClick={() => handleClick('Jawa')}
            ariaLabel="switch to jawa mode"
            testId="btnJawaMode"
          />
          <MenuButton
            title="Dark"
            onClick={() => handleClick('Dark')}
            ariaLabel="switch to dark mode"
            testId="btnDarkMode"
          />
        </div>
        <div className={[styles.subMenu, styles.lang].join(' ')}>
          <MenuButton
            title="English"
            onClick={() => handleClick('en')}
            ariaLabel="switch to english"
            testId="btnEnglish"
          />
          <MenuButton
            title="Français"
            onClick={() => handleClick('fr')}
            ariaLabel="switch to french"
            testId="btnFrench"
          />
          <MenuButton
            title="Svenska"
            onClick={() => handleClick('sv')}
            ariaLabel="switch to swedish"
            testId="btnSwedish"
          />
        </div>
      </div>
      {/* blanket placed below menu so menu is tabbable */}
      <MenuBlanket onClose={onClose} />
    </>
  );
}

Menu.propTypes = {
  showMenu: PropTypes.bool.isRequired,
  delay: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};
