import PropTypes from 'prop-types';
import WeatherIcon from '@/components/WeatherIcon';
import styles from '@/styles/main/DailyCard.module.css';
import { useUtils } from '@/contexts/UtilsContext';
import { usePrefsWeather } from '@/contexts/PrefsContext';

export default function DailyCard({ day }) {
  console.log('DailyCard rendered!');
  const { units, lang } = usePrefsWeather();
  const { getUnitOfMeasure, getTranslation, df, getIconUrl } = useUtils();

  return (
    <div className={styles.dailyCard} data-testid="daily-card">
      <WeatherIcon
        weatherIcon={day.icon}
        weatherIconSize="small"
        weatherDescription={day.description}
        getIconUrl={getIconUrl}
        testId="day-weather-icon"
        imgWidth="50"
        imgHeight="50"
      />
      <div className={styles.dailyDay} data-testid="day-name">
        {df.formatDayOfWeek(day.timestamp, lang)}
      </div>
      <div data-testid="day-hl">
        <span data-testid="day-high">{day.high}</span>/
        <span data-testid="day-low">{day.low}°</span>
      </div>
      <div className={styles.dailyDescription} data-testid="day-description">
        {day.description}
      </div>
      <div className={styles.dayLabel}>
        <span data-translation="10">
          {getTranslation(10, lang)}
          {': '}&nbsp;
        </span>
        <span className={styles.dayValue} data-testid="day-humidity">
          {day.humidity}%
        </span>
      </div>
      <div className={styles.dayLabel}>
        <span data-translation="11">
          {getTranslation(11, lang)}
          {': '}&nbsp;
        </span>
        <span className={styles.dayValue} data-testid="day-wind">
          {day.windSpeed} {getUnitOfMeasure(units, 'velocity')}{' '}
          {day.windDirection}
        </span>
      </div>
    </div>
  );
}

DailyCard.propTypes = {
  day: PropTypes.shape({
    description: PropTypes.string.isRequired,
    high: PropTypes.number.isRequired,
    humidity: PropTypes.number.isRequired,
    icon: PropTypes.string.isRequired,
    low: PropTypes.number.isRequired,
    precip: PropTypes.number.isRequired,
    timestamp: PropTypes.number.isRequired,
    windDeg: PropTypes.number.isRequired,
    windDirection: PropTypes.string.isRequired,
    windSpeed: PropTypes.number.isRequired,
  }).isRequired,
};
