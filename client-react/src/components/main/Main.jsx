import SectionHeading from '@/components/main/SectionHeading';
import CurrentContainer from '@/components/main/CurrentContainer';
import DailyContainer from '@/components/main/DailyContainer';
import HourlyContainer from '@/components/main/HourlyContainer';
import styles from '@/styles/main/Main.module.css';
import { useMainWeatherData } from '@/contexts/MainWeatherContext';

export default function Main() {
  console.log('Main rendered!');
  const { mainWeather } = useMainWeatherData();

  // prevent rendering until there main weather exists
  if (!mainWeather.length) return;
  console.log('Main MainWeather: ', mainWeather);

  const weather = mainWeather[0];

  return (
    <main className={styles.main}>
      <div className={styles.currentSection}>
        <SectionHeading
          section="current"
          titleTranslationId={2}
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
          titleTranslationId={3}
          timestamp={weather.current.timestamp}
          timezone={weather.coordinates.timezone}
          subtitleTestId="subtitle-forecast"
        />
        <DailyContainer daily={weather.daily} />
      </div>
      <div className={styles.hourlySection}>
        <SectionHeading
          section="hourly"
          titleTranslationId={4}
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
