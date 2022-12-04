import styles from '../styles/PageLayout.module.css';

export default function PageLayout() {
  return (
    <div className={styles.pageContainer}>
      <div />
      <section>Places</section>
      <main>Main</main>
      <footer>Footer</footer>
      <div>Gutter</div>
    </div>
  );
}
