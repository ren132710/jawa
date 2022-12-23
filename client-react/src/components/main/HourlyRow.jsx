import PropTypes from 'prop-types';
import styles from '../../styles/main/HourlyRow.module.css';
import { usePrefsData } from '../../contexts/PrefsContext';
import { useUtils } from '../../contexts/UtilsContext';

export default function HourlyRow({ coordinates, hour }) {
  const { units, lang } = usePrefsData();
  const { getUnitOfMeasure, getTranslation, df, getIconUrl } = useUtils();
  console.log('HourlyRow rendered!');

  return (
    <div className={styles.hourRow}>
      <div className={styles.hourData}>
        <div
          className={[styles.hourLabel, styles.hourDay].join(' ')}
          data-hour-date
        >
          {df.formatDayOfWeek(hour.timestamp, lang)}
        </div>
        <div className={styles.hourValueMargin}>
          <span className={styles.hourValue} data-hour>
            {df.formatZonedHour(hour.timestamp, coordinates.timezone)}
          </span>
        </div>
      </div>
      <div className={styles.hourData}>
        <img
          className="weather-icon"
          src={getIconUrl(hour.icon)}
          width="50"
          height="50"
          alt={hour.description}
          data-hour-icon
        />
      </div>
      <div className={styles.hourData}>
        <div className={styles.hourLabel}>Temp</div>
        <div className={styles.hourValueMargin}>
          <span
            className={[styles.hourValue, 'degrees'].join(' ')}
            data-hour-temp
          >
            {hour.temp}
          </span>
        </div>
      </div>
      <div className={styles.hourData}>
        <div className={styles.hourLabel} data-dictionary="7">
          {getTranslation(7, lang)}
        </div>
        <div className={styles.hourValueMargin}>
          <span
            className={[styles.hourValue, 'percent'].join(' ')}
            data-hour-precip
          >
            {hour.precip}
          </span>
        </div>
      </div>
      <div className={styles.hourData}>
        <div className={styles.hourLabel} data-dictionary="11">
          {getTranslation(11, lang)}
        </div>
        <div className={styles.hourValueMargin}>
          <span
            className={styles.hourValue}
            data-hour-wind-speed
            data-wind-units={` ${getUnitOfMeasure(units, 'velocity')} `}
          >
            {hour.windSpeed}
          </span>
          <span className={styles.hourValue} data-hour-wind-direction>
            {hour.windDirection}
          </span>
        </div>
      </div>
      <div className={styles.hourData}>
        <div className={styles.hourLabel} data-dictionary="10">
          {getTranslation(10, lang)}
        </div>
        <div className={styles.hourValueMargin}>
          <span
            className={[styles.hourValue, 'percent'].join(' ')}
            data-hour-humidity
          >
            {hour.humidity}
          </span>
        </div>
      </div>
      <div className={styles.hourData}>
        <div className={styles.hourLabel} data-dictionary="9">
          {getTranslation(9, lang)}
        </div>
        <div className={styles.hourValueMargin}>
          <span className={styles.hourValue} data-hour-uv-level>
            {hour.uvLevel}
          </span>
        </div>
      </div>
    </div>
  );
}

HourlyRow.propTypes = {
  coordinates: PropTypes.shape({
    id: PropTypes.string.isRequired,
    lang: PropTypes.string.isRequired,
    lat: PropTypes.number.isRequired,
    location: PropTypes.string.isRequired,
    long: PropTypes.number.isRequired,
    timezone: PropTypes.string.isRequired,
    timezone_offset: PropTypes.number.isRequired,
    units: PropTypes.string.isRequired,
  }).isRequired,
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
