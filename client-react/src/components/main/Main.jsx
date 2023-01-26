import SectionHeading from '@/components/main/SectionHeading';
import CurrentContainer from '@/components/main/CurrentContainer';
import DailyContainer from '@/components/main/DailyContainer';
import HourlyContainer from '@/components/main/HourlyContainer';
import styles from '@/styles/main/Main.module.css';
import { useWeatherData } from '@/contexts/WeatherContext';
import { useSelectedWeather } from '@/contexts/SelectedWeatherContext';

export default function Main() {
  console.log('Main rendered!');
  const { placesWeatherData, searchWeatherData, isLoading, isError } =
    useWeatherData();
  const { selectedWeather } = useSelectedWeather();

  console.log('Main:searchWeatherData: ', searchWeatherData);
  console.log('Main:placesWeatherData: ', placesWeatherData);

  // prevent rendering until weather data is loaded
  if (isError || isLoading) return;
  if (!placesWeatherData.length && !searchWeatherData.length) return;
  if (selectedWeather.search === false && !placesWeatherData.length) return;
  if (
    selectedWeather.search === false &&
    !placesWeatherData.find(
      (place) => place.coordinates.id === selectedWeather.id
    )
  )
    return;
  if (selectedWeather.search === true && !searchWeatherData.length) return;

  // now we can render
  const weather =
    selectedWeather.search === false
      ? placesWeatherData.find(
          (place) => place.coordinates.id === selectedWeather.id
        )
      : searchWeatherData[0];

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
