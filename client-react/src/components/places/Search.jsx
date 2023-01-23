import styles from '@/styles/places/Search.module.css';

export default function Search() {
  console.log('Search rendered!');
  /**
   * TODO: should Search refresh all weather data?
   *  - present weather data for a searched place, do not add to Places state
   *   - or,
  
      - first remove any place where Favorite=false from Places[]
        - NOTE: filter creates a new array, so it's not mutating state
   *    - places.filter(place => place.favorite !=== false)
   *  - copy Places[] to new array, then unshift searched place to Places[]
   *  - call setPlaces(newPlaces)
   *  - reload weather data for all Places[]
   *
   */

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        className={styles.search}
        placeholder="Weather at your places"
        data-testid="place-search"
      />
    </div>
  );
}
