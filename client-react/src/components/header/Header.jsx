import { useEffect, useRef } from 'react';
import Logo from './Logo';
import Hamburger from './Hamburger';
import Menu from './Menu';
import styles from '../../styles/header/Header.module.css';

export default function Header() {
  const headerRef = useRef(null);

  useEffect(() => {
    const handleHeaderActive = () => {
      if (window.scrollY > 0) {
        headerRef.current.classList.add(styles.headerActive);
      } else {
        headerRef.current.classList.remove(styles.headerActive);
      }
    };

    window.addEventListener('scroll', handleHeaderActive);

    // remove event listener when component unmounts
    return () => {
      window.removeEventListener('scroll', handleHeaderActive);
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
