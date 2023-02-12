import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from '@/styles/places/Search.module.css';
import { useMainWeatherAPI } from '@/contexts/MainWeatherContext';
import { usePrefsData } from '@/contexts/PrefsContext';
import getWeather from '@/utils/getWeather';

// https://developers.google.com/maps/documentation/javascript/place-autocomplete#constraining-autocomplete
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
  const { setMainWeather } = useMainWeatherAPI();
  const { units, lang } = usePrefsData();

  useEffect(() => {
    console.log('Search useEffect is called!');
    if (!inputRef.current) return;

    loader.load().then((google) => {
      autoCompleteRef.current = new google.maps.places.Autocomplete(
        inputRef.current,
        mapsOptions
      );
      if (!autoCompleteRef.current) return;

      autoCompleteRef.current.addListener('place_changed', async () => {
        const place = autoCompleteRef.current.getPlace();
        console.log('place: ', place);
        if (!place.geometry) return;

        const weatherData = await handleSearchForWeather(place);
        console.log('search weatherData: ', weatherData);
        setMainWeather([weatherData]);
      });
    });

    async function handleSearchForWeather(place) {
      const params = {
        id: 'search',
        location: place.name,
        lat: place.geometry.location.lat(),
        long: place.geometry.location.lng(),
        units,
        lang,
      };

      const res = getWeather(params);
      const weather = res.then((data) => {
        return data;
      });

      return weather;
    }

    // run this effect if the loader changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loader]);

  // clear the Search box when the user clicks away
  useEffect(() => {
    const clearInput = () => {
      inputRef.current.value = '';
    };
    window.addEventListener('click', clearInput);
    return () => window.removeEventListener('click', clearInput);
  }, []);

  // clear the Search box when the user escapes or tabs away
  useEffect(() => {
    const clearInput = (e) => {
      if (e.key === 'Escape' || e.key === 'Tab') inputRef.current.value = '';
    };
    window.addEventListener('keydown', clearInput);
    return () => window.removeEventListener('keydown', clearInput);
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
