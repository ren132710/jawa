import styles from '../../styles/header/Hamburger.module.css';

export default function Hamburger() {
  function handleClick() {
    const body = document.querySelector('body');
    body.classList.toggle('open');
  }

  return (
    <button type="button" className={styles.hamburger} onClick={handleClick}>
      <span className={styles.hamburgerTop} />
      <span className={styles.hamburgerMiddle} />
      <span className={styles.hamburgerBottom} />
    </button>
  );
}
