import { useEffect, useRef } from 'react';
import Logo from './Logo';
import Hamburger from './Hamburger';
import styles from '../../styles/topbar/Topbar.module.css';

export default function Topbar() {
  const topbarRef = useRef(null);

  console.log('TopBar rendered!');

  useEffect(() => {
    const handleTopbarActive = () => {
      if (window.scrollY > 0) {
        topbarRef.current.classList.add(styles.topbarActive);
      } else {
        topbarRef.current.classList.remove(styles.topbarActive);
      }
    };

    window.addEventListener('scroll', handleTopbarActive);

    // remove event listener when component unmounts
    return () => {
      window.removeEventListener('scroll', handleTopbarActive);
    };
  }, []);

  return (
    <header ref={topbarRef} className={[styles.topbarContainer].join(' ')}>
      <Logo />
      <Hamburger />
    </header>
  );
}
