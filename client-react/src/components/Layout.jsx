import React, { useEffect } from 'react';
import Search from './places/Search';
import Places from './places/Places';
import Main from './Main';
import { useWeatherData, useWeatherAPI } from '../contexts/WeatherContext';
import styles from '../styles/PageLayout.module.css';
import { PLACES_STORAGE_KEY } from '../constants/defaults';

export default function PageLayout() {
  const { isLoading, isError, weatherData } = useWeatherData();
  const { setPlaces } = useWeatherAPI();

  console.log('Layout rendered!');

  // initialize weather on initial render
  useEffect(() => {
    const places = JSON.parse(localStorage.getItem(PLACES_STORAGE_KEY));
    setPlaces(places);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.pageContainer}>
      <div />
      <section className={styles.placesSection}>
        <Search />
        <Places />
      </section>
      <Main isLoading={isLoading} isError={isError} weather={weatherData[3]} />
      <footer>Footer</footer>
      <div>Gutter</div>
    </div>
  );
}
