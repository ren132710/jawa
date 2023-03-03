import SectionHeading from '@/components/main/SectionHeading';
import CurrentContainer from '@/components/main/CurrentContainer';
import DailyContainer from '@/components/main/DailyContainer';
import HourlyContainer from '@/components/main/HourlyContainer';
import styles from '@/styles/main/Main.module.css';
import { useMainWeatherData } from '@/contexts/MainWeatherContext';

export default function Main() {
  console.log('Main rendered!');
  const { mainWeather } = useMainWeatherData();

  // prevent rendering until mainWeather exists
  if (!mainWeather.length) return;

  const weather = mainWeather[0];
  console.log('Main weather: ', weather);

  return (
    <main className={styles.main}>
      <div className={styles.currentSection}>
        <SectionHeading
          section="current"
          translationId={2}
          timestamp={weather.current.timestamp}
          timezone={weather.coordinates.timezone}
          subtitleTestId="subtitle-current"
        />
        <CurrentContainer
          coordinates={weather.coordinates}
          current={weather.current}
        />
      </div>
      <div className={styles.dailySection}>
        <SectionHeading
          section="forecast"
          translationId={3}
          timestamp={weather.current.timestamp}
          timezone={weather.coordinates.timezone}
          subtitleTestId="subtitle-forecast"
        />
        <DailyContainer daily={weather.daily} />
      </div>
      <div className={styles.hourlySection}>
        <SectionHeading
          section="hourly"
          translationId={4}
          timestamp={weather.current.timestamp}
          timezone={weather.coordinates.timezone}
          subtitleTestId="subtitle-hourly"
        />
        <HourlyContainer
          coordinates={weather.coordinates}
          hourly={weather.hourly}
        />
      </div>
    </main>
  );
}
