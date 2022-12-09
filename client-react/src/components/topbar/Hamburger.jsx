import { useState } from 'react';
import Menu from './Menu';
import styles from '../../styles/topbar/Hamburger.module.css';

export default function Hamburger() {
  const [showMenu, setShowMenu] = useState(false);

  console.log('Hamburger rendered!');
  console.log('showMenu:', showMenu);

  return (
    <>
      <button
        type="button"
        className={`${styles.hamburger} ${showMenu ? ' open' : ''}`}
        onClick={() => setShowMenu(true)}
      >
        <span className={styles.hamburgerTop} />
        <span className={styles.hamburgerMiddle} />
        <span className={styles.hamburgerBottom} />
      </button>
      {showMenu && <Menu onClose={() => setShowMenu(false)} />}
    </>
  );
}
