import { useEffect, useRef } from 'react';
import Logo from '@/components/topbar/Logo';
import Hamburger from '@/components/topbar/Hamburger';
import styles from '@/styles/topbar/Topbar.module.css';

export default function Topbar() {
  console.log('TopBar rendered!');
  const topbarRef = useRef(null);

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
    <header ref={topbarRef} className={styles.topbarContainer}>
      <Logo />
      <Hamburger />
    </header>
  );
}
