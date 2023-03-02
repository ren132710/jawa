import PropTypes from 'prop-types';
import WeatherIcon from '@/components/WeatherIcon';
import styles from '@/styles/main/HourlyRow.module.css';
import { usePrefsWeather } from '@/contexts/PrefsContext';
import { useUtils } from '@/contexts/UtilsContext';

export default function HourlyRow({ timezone, hour }) {
  console.log('HourlyRow rendered!');
  const { units, lang } = usePrefsWeather();
  const { getUnitOfMeasure, getTranslation, df, getIconUrl } = useUtils();

  return (
    <div className={styles.hourRow} data-testid="hour-row">
      <div className={styles.hourData}>
        <div
          className={[styles.hourLabel, styles.hourDay].join(' ')}
          data-testid="hour-day"
        >
          {df.formatDayOfWeek(hour.timestamp, lang)}
        </div>
        <div className={styles.hourValueMargin}>
          <span className={styles.hourValue} data-testid="hour-name">
            {df.formatZonedHour(hour.timestamp, timezone)}
          </span>
        </div>
      </div>
      <div className={styles.hourData}>
        <WeatherIcon
          weatherIcon={hour.icon}
          weatherIconSize="small"
          weatherDescription={hour.description}
          getIconUrl={getIconUrl}
          testId="hour-weather-icon"
          imgWidth="50"
          imgHeight="50"
        />
      </div>
      <div className={styles.hourData}>
        <div className={styles.hourLabel}>Temp</div>
        <div className={styles.hourValueMargin}>
          <span className={styles.hourValue} data-testid="hour-temp">
            {hour.temp}°
          </span>
        </div>
      </div>
      <div className={styles.hourData}>
        <div className={styles.hourLabel} data-translation="7">
          {getTranslation(7, lang)}
        </div>
        <div className={styles.hourValueMargin}>
          <span className={styles.hourValue} data-testid="hour-precip">
            {hour.precip}%
          </span>
        </div>
      </div>
      <div className={styles.hourData}>
        <div className={styles.hourLabel} data-translation="11">
          {getTranslation(11, lang)}
        </div>
        <div className={styles.hourValueMargin}>
          <span className={styles.hourValue} data-testid="hour-wind">
            {hour.windSpeed} {getUnitOfMeasure(units, 'velocity')}{' '}
            {hour.windDirection}
          </span>
        </div>
      </div>
      <div className={styles.hourData}>
        <div className={styles.hourLabel} data-translation="10">
          {getTranslation(10, lang)}
        </div>
        <div className={styles.hourValueMargin}>
          <span className={styles.hourValue} data-testid="hour-humidity">
            {hour.humidity}%
          </span>
        </div>
      </div>
      <div className={styles.hourData}>
        <div className={styles.hourLabel} data-translation="9">
          {getTranslation(9, lang)}
        </div>
        <div className={styles.hourValueMargin}>
          <span className={styles.hourValue} data-testid="hour-uv-level">
            {hour.uvLevel}
          </span>
        </div>
      </div>
    </div>
  );
}

HourlyRow.propTypes = {
  timezone: PropTypes.string.isRequired,
  hour: PropTypes.shape({
    description: PropTypes.string.isRequired,
    humidity: PropTypes.number.isRequired,
    icon: PropTypes.string.isRequired,
    precip: PropTypes.number.isRequired,
    temp: PropTypes.number.isRequired,
    timestamp: PropTypes.number.isRequired,
    uvIndex: PropTypes.number.isRequired,
    uvLevel: PropTypes.string.isRequired,
    windDeg: PropTypes.number.isRequired,
    windDirection: PropTypes.string.isRequired,
    windSpeed: PropTypes.number.isRequired,
  }).isRequired,
};
