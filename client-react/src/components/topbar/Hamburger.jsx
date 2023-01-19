import { useState, useEffect } from 'react';
import Menu from './Menu';
import styles from '../../styles/topbar/Hamburger.module.css';

export default function Hamburger() {
  const [showMenu, setShowMenu] = useState(false);
  const [showComponent, setShowComponent] = useState(false);
  const delay = 200;
  console.log('Hamburger rendered!');

  useEffect(() => {
    let timeoutId;

    if (showMenu && !showComponent) {
      setShowComponent(true);
    } else if (!showMenu && showComponent) {
      timeoutId = setTimeout(() => setShowComponent(false), delay);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [showMenu, showComponent]);

  return (
    <>
      <button
        type="button"
        className={`${styles.hamburger} ${showMenu ? ' open' : ''}`}
        onClick={() => setShowMenu(!showMenu)}
      >
        <span className={styles.hamburgerTop} />
        <span className={styles.hamburgerMiddle} />
        <span className={styles.hamburgerBottom} />
      </button>
      {showComponent ? (
        <Menu
          showMenu={showMenu}
          delay={delay}
          onClose={() => setShowMenu(false)}
        />
      ) : null}
    </>
  );
}
