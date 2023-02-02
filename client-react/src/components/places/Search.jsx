import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import styles from '@/styles/places/Search.module.css';
import { useWeatherAPI } from '@/contexts/WeatherContext';
import { useSelectedWeather } from '@/contexts/SelectedWeatherContext';

const mapsOptions = {
  // types: ['(cities)'],
  types: ['geocode'],
  // componentRestrictions: { country: 'us' },
  fields: ['name', 'geometry.location'],
};

export default function Search({ loader }) {
  console.log('Search is rendered!');
  const autoCompleteRef = useRef(null);
  const inputRef = useRef(null);
  const { setSelectedWeather } = useSelectedWeather();
  const { setSearch } = useWeatherAPI();

  useEffect(() => {
    console.log('Search useEffect is called!');
    if (!inputRef.current) return;

    loader.load().then((google) => {
      autoCompleteRef.current = new google.maps.places.Autocomplete(
        inputRef.current,
        mapsOptions
      );
      console.log('autoCompleteRef.current', autoCompleteRef.current);
      if (!autoCompleteRef.current) return;

      autoCompleteRef.current.addListener('place_changed', () => {
        const place = autoCompleteRef.current.getPlace();
        if (!place.geometry) return;
        handleSearchPlaceWeather(place);
      });
    });

    function handleSearchPlaceWeather(place) {
      console.log('place', place);
      const params = {
        id: uuidv4(),
        location: place.name,
        lat: place.geometry.location.lat(),
        long: place.geometry.location.lng(),
      };

      // remember, we store search in an array so it's iterable by useGetWeather
      setSearch([params]);
      setSelectedWeather({
        id: params.id,
        search: true,
      });
    }
  }, [loader, setSearch, setSelectedWeather]);

  // clear the input field with the user clicks away
  useEffect(() => {
    const clearInput = () => {
      inputRef.current.value = '';
    };
    window.addEventListener('click', clearInput);
    return () => window.removeEventListener('click', clearInput);
  }, []);

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Weather at your places"
        ref={inputRef}
        data-testid="place-search"
      />
    </div>
  );
}

Search.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  loader: PropTypes.object.isRequired,
};
