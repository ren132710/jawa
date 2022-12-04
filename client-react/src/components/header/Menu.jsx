import Button from './Button';
import styles from '../../styles/header/Menu.module.css';

function handleClick(value) {
  console.log('clicked', value);
}

export default function Menu() {
  return (
    <div className={styles.menu}>
      <div className={[styles.subMenu, styles.units].join(' ')}>
        <Button onClick={() => handleClick('Metric')}>Metric</Button>
        <Button onClick={() => handleClick('Imperial')}>Imperial</Button>
      </div>
      <div className={[styles.subMenu, styles.theme].join(' ')}>
        <Button onClick={() => handleClick('Light')}>Light</Button>
        <Button onClick={() => handleClick('Jawa')}>Jawa</Button>
        <Button onClick={() => handleClick('Dark')}>Dark</Button>
      </div>
      <div className={[styles.subMenu, styles.lang].join(' ')}>
        <Button onClick={() => handleClick('English')}>English</Button>
        <Button onClick={() => handleClick('French')}>French</Button>
        <Button onClick={() => handleClick('Swedish')}>Swedish</Button>
      </div>
    </div>
  );
}
