import CurrentContainer from './CurrentContainer';
import DailyContainer from './DailyContainer';
import HourlyContainer from './HourlyContainer';
import styles from '../../styles/main/Main.module.css';
import { useWeatherData } from '../../contexts/WeatherContext';

export default function Main() {
  const { weatherData, isLoading, isError } = useWeatherData();

  console.log('Main rendered!');

  if (isError || isLoading) return;
  if (!weatherData.length) return;
  const weather = weatherData[0];

  return (
    <main className={styles.main}>
      <div className={styles.currentSection}>
        <CurrentContainer
          coordinates={weather.coordinates}
          current={weather.current}
        />
      </div>
      <div className={styles.dailySection}>
        <DailyContainer daily={weather.daily} />
      </div>
      <div className={styles.hourlySection}>
        <HourlyContainer hourly={weather.hourly} />
      </div>
    </main>
  );
}
