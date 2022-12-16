import Search from './places/Search';
import Places from './places/Places';
import styles from '../styles/PageLayout.module.css';

export default function PageLayout() {
  console.log('PageLayout rendered!');

  return (
    <div className={styles.pageContainer}>
      <div />
      <section className={styles.placesSection}>
        <Search />
        <Places />
      </section>
      <main>Main</main>
      <footer>Footer</footer>
      <div>Gutter</div>
    </div>
  );
}
