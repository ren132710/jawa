import SectionHeading from '@/components/main/SectionHeading';
import CurrentContainer from '@/components/main/CurrentContainer';
import DailyContainer from '@/components/main/DailyContainer';
import HourlyContainer from '@/components/main/HourlyContainer';
import styles from '@/styles/main/Main.module.css';
import { useWeatherData } from '@/contexts/WeatherContext';

export default function Main() {
  const { weatherData, isLoading, isError } = useWeatherData();
  console.log('Main rendered!');

  // wait until the weather data is loaded
  if (isError || isLoading) return;
  if (!weatherData.length) return;

  // TODO: render weather for selected place, search
  const weather = weatherData[0];

  //   titleTranslationId,
  // timeUnit,
  // timestamp,
  // timezone,
  // subtitleTestHandle,

  return (
    <main className={styles.main}>
      <div className={styles.currentSection}>
        <SectionHeading
          section="current"
          titleTranslationId={2}
          timestamp={weather.current.timestamp}
          timezone={weather.coordinates.timezone}
          subtitleTestId="subtitle-dmt"
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
          subtitleTestId="subtitle-none"
        />
        <DailyContainer daily={weather.daily} />
      </div>
      <div className={styles.hourlySection}>
        <SectionHeading
          section="hourly"
          titleTranslationId={4}
          timestamp={weather.current.timestamp}
          timezone={weather.coordinates.timezone}
          subtitleTestId="subtitle-timezone"
        />
        <HourlyContainer
          coordinates={weather.coordinates}
          hourly={weather.hourly}
        />
      </div>
    </main>
  );
}
