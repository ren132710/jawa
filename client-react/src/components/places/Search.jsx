import styles from '../../styles/places/Search.module.css';

export default function Search() {
  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        className={styles.search}
        placeholder="Weather at your places"
        data-place-search
      />
    </div>
  );
}
