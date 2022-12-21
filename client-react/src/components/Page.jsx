import Search from './places/Search';
import Places from './places/Places';
import Main from './Main';
import styles from '../styles/PageLayout.module.css';

export default function Page() {
  console.log('Page rendered!');

  return (
    <div className={styles.pageContainer}>
      <div className="spacer" />
      <div className={styles.placesSection}>
        <Search />
        <Places />
      </div>
      <Main />
      <footer>Footer</footer>
      <div>Gutter</div>
    </div>
  );
}
