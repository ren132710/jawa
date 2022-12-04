import { useEffect, useRef } from 'react';
import Logo from './Logo';
import Hamburger from './Hamburger';
import Menu from './Menu';
import styles from '../../styles/header/Header.module.css';

export default function Header() {
  const headerRef = useRef(null);

  useEffect(() => {
    const handleBackgroundActive = () => {
      if (window.scrollY > 0) {
        headerRef.current.classList.add(styles.headerScrolled);
      } else {
        headerRef.current.classList.remove(styles.headerScrolled);
      }
    };

    window.addEventListener('scroll', handleBackgroundActive);

    // remove event listener when component unmounts
    return () => {
      window.removeEventListener('scroll', handleBackgroundActive);
    };
  }, []);

  return (
    <header ref={headerRef} className={[styles.headerContainer].join(' ')}>
      <Logo />
      <Hamburger />
      <Menu />
    </header>
  );
}
