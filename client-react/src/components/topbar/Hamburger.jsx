import styles from '../../styles/topbar/Hamburger.module.css';

function handleClick() {
  const body = document.querySelector('body');
  body.classList.toggle('open');
}

// TODO: consider using state to toggle menu
// TODO: close menu when clicking outside of menu
// TODO: Consider using menu blanket to close menu when clicking outside of menu
// TODO: Benefit: no DOM event listeners needed
// https://codesandbox.io/s/re-renders-bad-with-dialog-fixed-rrfey?file=/src/country-settings/modal-dialog.tsx

export default function Hamburger() {
  console.log('Hamburger rendered!');

  return (
    <button type="button" className={styles.hamburger} onClick={handleClick}>
      <span className={styles.hamburgerTop} />
      <span className={styles.hamburgerMiddle} />
      <span className={styles.hamburgerBottom} />
    </button>
  );
}
