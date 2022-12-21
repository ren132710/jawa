import Search from './places/Search';
import Places from './places/Places';
import Main from './Main';
import { useWeatherData, useWeatherAPI } from '../contexts/WeatherContext';
import styles from '../styles/PageLayout.module.css';

export default function Page() {
  const [isLoading, isError, weatherData] = useWeatherData();
  const [fetchWeather] = useWeatherAPI();
  console.log('fetchWeather: ', fetchWeather);

  console.log('Page rendered!');

  return (
    <div className={styles.pageContainer}>
      <div />
      <section className={styles.placesSection}>
        <Search />
        <Places />
      </section>
      <Main isLoading={isLoading} isError={isError} weather={weatherData[0]} />
      <footer>Footer</footer>
      <div>Gutter</div>
    </div>
  );
}
