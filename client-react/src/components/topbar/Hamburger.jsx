import { useState, useEffect, lazy } from 'react';
import styles from '@/styles/topbar/Hamburger.module.css';

// wait to fetch Menu until it's needed
const Menu = lazy(() => import('@/components/topbar/Menu'));

export default function Hamburger() {
  console.log('Hamburger rendered!');
  const [showMenu, setShowMenu] = useState(false);
  const [showComponent, setShowComponent] = useState(false);
  const delay = 200;

  // transition menu open/close
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
        aria-label="menu button"
        aria-expanded={showMenu}
        data-testid="hamburger"
      >
        <span className={styles.hamburgerTop} />
        <span className={styles.hamburgerMiddle} />
        <span className={styles.hamburgerBottom} />
      </button>
      {showComponent ? (
        <Menu
          showMenu={showMenu}
          delay={delay}
          onClose={() => setShowMenu(!showMenu)}
        />
      ) : null}
    </>
  );
}
