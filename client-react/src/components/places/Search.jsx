import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from '@/styles/places/Search.module.css';
import { useUtils } from '@/contexts/UtilsContext';
import { usePrefsWeather } from '@/contexts/PrefsContext';
import { useHasError } from '@/contexts/HasErrorContext';
import { useMainWeatherAPI } from '@/contexts/MainWeatherContext';
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
  const { units, lang } = usePrefsWeather();
  const { setHasError } = useHasError();
  const { setMainWeather } = useMainWeatherAPI();
  const { getTranslation } = useUtils();

  useEffect(() => {
    console.log('Search useEffect (google autocomplete)!');
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
        if (!place) return;
        if (!place.geometry) return;

        handleSearchForWeather(place);
      });

      // there doesn't seem to be a way to remove the autocomplete listener
    });

    function handleSearchForWeather(place) {
      // getWeather expects an array of place objects, even if there is only one place object
      const places = [
        {
          id: 'search',
          location: place.name,
          // lat: 'bad',
          lat: place.geometry.location.lat(),
          long: place.geometry.location.lng(),
        },
      ];

      // reset hasError if it was previously set to true
      setHasError(false);

      getWeather({ places, units, lang })
        .then((weather) => {
          console.log('Search (weather): ', weather);
          setMainWeather(weather);
        })
        .catch((err) => {
          setHasError(true);
          console.log('Search (error): ', err);
        });
    }

    // run this effect only if the loader changes
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
        placeholder={getTranslation(1, lang)}
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
