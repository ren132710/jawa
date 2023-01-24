import SectionHeading from '@/components/main/SectionHeading';
import CurrentContainer from '@/components/main/CurrentContainer';
import DailyContainer from '@/components/main/DailyContainer';
import HourlyContainer from '@/components/main/HourlyContainer';
import styles from '@/styles/main/Main.module.css';
import { useWeatherData } from '@/contexts/WeatherContext';

export default function Main() {
  console.log('Main rendered!');
  const {
    selectedWeatherId,
    placesWeatherData,
    searchWeatherData,
    isLoading,
    isError,
  } = useWeatherData();

  console.log('selectedWeatherId: ', selectedWeatherId);
  console.log('placesWeatherData: ', placesWeatherData);
  console.log('searchWeatherData: ', searchWeatherData);
  console.log('isLoading: ', isLoading);
  console.log('isError: ', isError);

  // wait until the weather data is loaded
  if (isError || isLoading) return;
  if (!placesWeatherData.length && !searchWeatherData.length) return;

  // TODO: use WeatherContext isSearch flag instead??
  const weather =
    selectedWeatherId.belongsTo === 'places'
      ? placesWeatherData.find(
          (place) => place.coordinates.id === selectedWeatherId.id
        )
      : searchWeatherData[0];

  console.log('weather from Main: ', weather);

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
