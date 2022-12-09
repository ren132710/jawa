import { useEffect, useRef } from 'react';
import Button from './Button';
import styles from '../../styles/topbar/Menu.module.css';

function handleClick(value) {
  console.log('clicked', value);
}

export default function Menu() {
  const menuRef = useRef();
  console.log('menuRef', menuRef);
  console.log('Menu rendered!');

  // TODO: Replace Menu modal with menu blanket approach, eliminate event listeners

  useEffect(() => {
    if (!menuRef.current) return;

    const handleClickAway = (e) => {
      console.log('e.target', e.target);
      const body = document.querySelector('body');

      /**
       * For this approach to work would need to forward ref from Hamburger to Menu and
       * pass it to handleClickAway. Then also check if e.target is hamburgerRef.current.
         if (
          !menuRef.current.contains(e.target) &&
          !hamburgerRef.current.contains(e.target)
        )
          body.classList.remove('open');
       */

      if (!menuRef.current.contains(e.target)) body.classList.remove('open');
    };

    document.addEventListener('click', handleClickAway);

    // remove event listener when component unmounts
    return () => {
      document.removeEventListener('click', handleClickAway);
    };
  }, []);

  return (
    <div ref={menuRef} className={styles.menu}>
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
        <Button title="French" onClick={() => handleClick('fr')} />
        <Button title="Swedish" onClick={() => handleClick('sv')} />
      </div>
    </div>
  );
}
