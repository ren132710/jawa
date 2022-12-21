import Search from './places/Search';
import Places from './places/Places';
import Main from './Main';

import styles from '../styles/PageLayout.module.css';

export default function Page() {
  console.log('Page rendered!');

  return (
    <div className={styles.pageContainer}>
      <div />
      <section className={styles.placesSection}>
        <Search />
        <Places />
      </section>
      <Main />
      <footer>Footer</footer>
      <div>Gutter</div>
    </div>
  );
}
