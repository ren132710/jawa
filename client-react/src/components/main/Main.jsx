import CurrentContainer from './CurrentContainer';
import DailyContainer from './DailyContainer';
import HourlyContainer from './HourlyContainer';
import styles from '../../styles/main/Main.module.css';
import { useWeatherData } from '../../contexts/WeatherContext';

export default function Main() {
  const { weatherData, isError } = useWeatherData();
  if (!weatherData) return;
  console.log('Main rendered!');
  console.log('isError from Main: ', isError);
  console.log('weatherData from Main: ', weatherData);

  return (
    <main className={styles.main}>
      {isError ? null : (
        <>
          <div className={styles.currentSection}>
            <CurrentContainer
              currentCoordinates={weatherData[0].coordinates}
              currentWeather={weatherData[0].current}
            />
          </div>
          <div className={styles.dailySection}>
            <DailyContainer daily={weatherData[0].daily} />
          </div>
          <div className={styles.hourlySection}>
            <HourlyContainer hourly={weatherData[0].hourly} />
          </div>
        </>
      )}
    </main>
  );
}
